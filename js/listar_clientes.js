// Configuración de la URL base de tu API en Node.js
const API_URL = 'http://192.168.100.66:8081/clientes';
const URL_PUT = "http://192.168.100.66:8081/clientes";
const URL_POST = "http://192.168.100.66:8081/clientes";

const URL_DELETE = "http://192.168.100.66:8081/clientes/:id/inactivar";

//Llenar la tabla con todos los clientes activos

// 4. CARGA INICIAL: OBTENER CLIENTES ACTIVOS AL CARGAR LA PÁGINA
document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.getElementById('tabla-clientes');
    
    try {
        // Hacemos la petición GET al endpoint de tu servidor Node.js
        const respuesta = await fetch(API_URL);
        
        if (!respuesta.ok) {
            throw new Error('No se pudieron obtener los clientes del servidor');
        }

        const respuestaJson = await respuesta.json();

        // Accedemos directamente a la propiedad 'listaClientes' que envía tu servidor

        const todosLosClientes = respuestaJson.listaClientes || [];

        // Filtramos para quedarnos SOLO con los que tengan status 'activo' 
        // (O los que no tengan la propiedad status definida, asumiendo que son activos por defecto)

        const clientesActivos = todosLosClientes.filter(u => u.status !=='inactivo');
        console.log("Activos:", clientesActivos);

        if (clientesActivos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted py-3">
                        No hay Clientes activos registrados.
                    </td>
                </tr>`;
            return;
        }

    
        
       

        tbody.innerHTML = '';

        clientesActivos.forEach(cliente => {
            const fila = document.createElement('tr');
            // Inyectamos el _id de MongoDB en el atributo data-id de la fila
            fila.setAttribute('data-id', cliente._id);

            const nombreCliente = (cliente.nombre );
            const email1 = cliente.email1;
            const email2 = (cliente.email2) ? cliente.email2 : '';
            const email3 = (cliente.email3) ? cliente.email3 : '';
            const email4 = (cliente.email4) ? cliente.email4 : '';
            const status = (cliente.status) ? cliente.status : '';
            console.log("datos extraidos:", nombreCliente, email1, email2, email3, email4, status);
        

            
           fila.innerHTML = `
                <td>
                    <input type="text" class="form-control form-control-sm" value="${nombreCliente}">
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm" value="${cliente.email1}">
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm" value="${cliente.email2}">
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm" value="${cliente.email3}">
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm" value="${cliente.email4}">
                </td>
                
                <td>
                    <select class="form-select form-select-sm">
                        <option value="admin" ${cliente.status === 'activo' ? 'selected' : ''}>Activo</option>
                        <option value="user" ${cliente.status === 'inactivo' ? 'selected' : ''}>Inactivo</option>
                    </select>
                </td>
                <td>
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-warning btn-sm text-white" onclick="actualizarCliente(this)">
                            <i class="bi bi-arrow-clockwise"></i> Actualizar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="borrarCliente(this)">
                            <i class="bi bi-trash"></i> Borrar
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(fila);
        });

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger py-3">
                    Error al conectar con el servidor. Intente nuevamente.
                </td>
            </tr>`;
    }
});


// 1. OBTENER LOS DATOS DE UNA FILA ESPECÍFICA
function obtenerDatosFila(boton) {
    const fila = boton.closest('tr');
    const id = fila.getAttribute('data-id') || null; // ObjectId de MongoDB
    const inputs = fila.querySelectorAll('input[type="text"]');
    const nombre = inputs[0].value.trim();
    const email1 = inputs[1].value.trim();
    const email2 = inputs[2].value.trim();
    const email3 = inputs[3].value.trim();
    const email4 = inputs[4].value.trim();
    const status = fila.querySelector('select').value;
   
   

    console.log("datosFila:", id, email1, email2, email3, email4, status)

    return { fila, id, datos: { nombre, email1, email2, email3, email4 } };
}

// 2. ACCIÓN: GUARDAR O ACTUALIZAR (POST O PUT)
async function actualizarCliente(boton) {
    const { fila, id, datos } = obtenerDatosFila(boton);
    console.log("datos recibidos:", fila, id, datos);

    

    //Configuracion dinamica de la peticion HTTP

    const esNuevoRegistro = !id;
    const url = esNuevoRegistro ? URL_POST : `${URL_PUT}/${id}`;
    const metodoHttp = esNuevoRegistro ? 'POST' : 'PUT';

    console.log("Peticion:", metodoHttp, url);
    console.log("Datos enviados:", datos);

    const datosEnviar = {
        nombre: datos.nombre,
        email1: datos.email1,
        email2: datos.email2,
        email3: datos.email3,
        email4: datos.email4,

        
        ...(esNuevoRegistro && {
            status: datos.status ?? true
        })
    };

    console.log('Método:', metodoHttp);
    console.log('URL:', url);
    console.log('Payload:', datosEnviar);

    try {
        const respuesta = await fetch(url, {
            method: metodoHttp,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) throw new Error('Error en el servidor al procesar la solicitud');
        
        const resultado = await respuesta.json();

        if(esNuevoRegistro) {
            // MongoDB generó un nuevo _id; lo guardamos en la fila para futuras actualizaciones o borrados
            fila.setAttribute('data-id', resultado._id);
            alert('Cliente creado y guardado con éxito');
        } else {
            alert('Cliente actualizado con éxito');
        }

    } catch (error) {
        console.error(error);
        alert('Hubo un error al intentar guardar los cambios.');
    }
}
        
// 4. ACCIÓN: BORRAR CLIENTE (DELETE)
async function borrarCliente(boton) {
    const { fila, id } = obtenerDatosFila(boton);
    console.log("fila id:", fila, id);

      if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;

    // Si la fila es nueva y no se ha guardado en BD, solo la eliminamos de la pantalla
    if (!id) {
        fila.remove();
        return;
    }
// Opción A: Usar un PUT/PATCH a tu endpoint de actualización enviando status 'inactivo'
   
    const datosActualizados = {
        status: "inactivo"
    };
     
    try {
        const respuesta = await fetch(`http://192.168.100.66:8081/clientes/${id}/inactivar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
             body: JSON.stringify(datosActualizados)
        });

        if (!respuesta.ok) throw new Error('Error al eliminar el usuario');

      
        fila.remove(); // Quitamos la fila del diseño HTML
        alert('Cliente inactivado de la base de datos');
    } catch (error) {
        console.error(error);
        alert('No se pudo inactivar el usuario');
    }
    
}
// 5. FUNCIÓN EXTRA: AGREGAR NUEVA FILA VACÍA A LA TABLA
function agregarFilaVacia() {
    const tbody = document.getElementById('tabla-clientes');
    const nuevaFila = document.createElement('tr');
    
    // No le asignamos data-id porque aún no existe en MongoDB
    nuevaFila.innerHTML = `
        <td><input type="text" class="form-control form-control-sm" placeholder="nombre"></td>
        <td><input type="text" class="form-control form-control-sm" placeholder="email1"></td>
        <td><input type="text" class="form-control form-control-sm" placeholder="email2"></td>
        <td><input type="text" class="form-control form-control-sm" placeholder="email3"></td>
        <td><input type="text" class="form-control form-control-sm" placeholder="email4"></td>

        <td>
            <select class="form-select form-select-sm">
                <option value="activo">activo</option>
                <option value="inactivo" selected>inactivo</option>
            </select>
        </td>
           
        
        <td>
            <div class="d-flex justify-content-center gap-1">
                <button type="button" 
                class="btn btn-warning btn-sm text-white"
                onClick="actualizarCliente(this)">
                <i class="bo bi-arrow-clockwise"></i>
                    Actualizar
                </button>
                <button type="button"
                 class="btn btn-danger btn-sm"
                 onClick="borrarCliente(this)">
                 <i class="bi bi-trash"></i>
                    Borrar
                </button>
            </div>
        </td>
    `;
    tbody.appendChild(nuevaFila);
}









