// Configuración de la URL base de tu API en Node.js
const API_URL = 'http://192.168.100.66:8081/informes'; //para listar informes
const API_URL_PDF = 'http://192.168.100.66:8081/informes/pdf/informe/:id'; //para obtener el PDF de un informe

//Llenar la tabla con todos los informes activos
let infoServicio = [];
// 4. CARGA INICIAL: OBTENER INFORMES ACTIVOS AL CARGAR LA PÁGINA
document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.getElementById('tabla-informes');
    
    
    try {
        // Hacemos la petición GET al endpoint de tu servidor Node.js
        const respuesta = await fetch(API_URL);
        
        if (!respuesta.ok) {
            throw new Error('No se pudieron obtener los informes del servidor');
        }
        
        formularios = await respuesta.json();

        console.log("formularios obtenidos:", formularios);
        console.log("informes", formularios.informes);
        infoServicio = formularios.informes;

      

        tbody.innerHTML = '';

        infoServicio.forEach(formulario => {
            const fila = document.createElement('tr');
            // Inyectamos el _id de MongoDB en el atributo data-id de la fila
            fila.setAttribute('data-id', formulario._id);

            const cliente = formulario.cliente;
            const numero = formulario.numero;
            const fecha = (formulario.fechaFin);
            
            console.log("datos extraidos:", cliente, numero, fecha);
        

            
           fila.innerHTML = `
                <td>
                    <input type="text" class="form-control form-control-sm" value="${cliente}">
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm" value="${numero}">
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm" value="${fecha}">
                </td>
                                
                <td>
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-info btn-sm text-black fw-bold" onclick="verDetalles(this)">
                            <i class="bi bi-arrow-clockwise"></i> Ver Detalles
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



async function verDetalles(boton) {
    informeId = boton.closest('tr').getAttribute('data-id');

    try {
        // Hacemos la petición GET al endpoint de tu servidor Node.js para obtener el PDF
        const respuesta = await fetch(API_URL_PDF.replace(':id', informeId));
        
        if (!respuesta.ok) {
            throw new Error('No se pudo obtener el PDF del informe');
        }
        
        const blob = await respuesta.blob();
        const url = URL.createObjectURL(blob);
        
        // Abrimos el PDF en una nueva ventana o pestaña
        window.open(url, '_blank');
    } catch (error) {
        console.error(error);
        alert('Error al obtener el PDF del informe. Intente nuevamente.');
    }
}   


        





























/*
var informes = [];
var clientes = [];
var columnas = ["cliente", "numero", "fecha", "Opciones"];
var cliente = '';
var is = [];

async function fetchClientes() {

    const res = await fetch('https://servering-production.up.railway.app/clientes', 
        {
            method: "GET",
            headers: { "auth": "auth" }
            
        });
           
    
    if (!res.ok) {
        const msg = `error en fetchClientes:, ${res.status}`;
        throw new Error(msg);
    } else {
            res.json()
            .then(data => {
                console.log('data', data);
                clientes = data.listaClientes;
                console.log('lista:', clientes);
                var select = document.getElementById("clientes");

                var opt = document.createElement("option");
                opt.text = "Seleccione un cliente";
                select.add(opt);

                console.log('lista de clientes:', clientes);

                clientes.forEach((item, index) => {
                    var option = document.createElement("option");
                    option.text = item.nombre;
                    select.add(option);
                });

                select.addEventListener("change", (e) => {

                    cliente = e.target.value;

                    if (!(cliente.localeCompare('Seleccione un cliente'))) {
                        cliente = '';
                    }

                    console.log('seleccionado: ', cliente);
                });

            });
        }
}
fetchClientes()
    .catch(e => {
        console.log('hubo un problema' + e.message);
    });


    var formulario = document.getElementById("form");


/*
function validar(e) {
    e.preventDefault();

    var inicio = document.getElementById("inicio").value;
    var fin = document.getElementById("fin").value;

    if (inicio == 0 && fin == 0 && cliente == 0) {
        alert('los campos deben tener valores')
        return;


    } else if (inicio == 0 && fin == 0 && cliente != 0) {
        inicio = 'undefined';
        fin = 'undefined';

    } else if (cliente == 0 && fin != 0 && inicio != 0) {
        cliente = 'undefined';
    }

    fetch(`'https://servering-production.up.railway.app/informes/inicio/${inicio}/fin/${fin}/cliente/${cliente}`)
        
        .then(response => response.json())
        .then(data => {
            informes = data.informes;
            console.log('Success:', data.informes)
            is = data.informes;
            document.getElementById("data-list").innerHTML = "";
            tabla(is);

        })
        .catch((error) => {
            console.error('Error:', error);
        })
}

formulario.addEventListener('submit', validar);

async function fetchInformes() {

    const res = fetch('https://servering-production.up.railway.app/informes', {
        method: "GET",
        headers: { "auth": "auth" }
    })
        .then(response => response.json())
        .then(data => {
            is = data.informes;
            console.log('is: ', is);
            tabla(is);
        });

}

fetchInformes()
    .catch(e => {
        console.log('hubo un problema' + e.message);

    });


function tabla(is) {
    var columnCount = columnas.length;
    console.log('cantidad columnas', columnCount);
    var rowCount = is.length;
    console.log('cantidad filas', rowCount);

    var table = document.createElement('table');

    document.getElementById("data-list").appendChild(table);

    var header = table.createTHead();

    var row = header.insertRow(-1);

    for (var i = 0; i < columnCount; i++) {

        var headerCell = document.createElement('th');

        headerCell.innerText = columnas[i].toUpperCase();

        row.appendChild(headerCell);
    }
    var tBody = document.createElement('tbody');

    table.appendChild(tBody);


    is.forEach((item, index) => {


        let row = table.insertRow();
        let id = item._id;
        let name = row.insertCell(0);

        name.innerHTML = `<input type = "text" id = "name[${index}]" size = '30' readonly value = ${item.cliente}></input>`;
        let numero = row.insertCell(1);
        numero.innerHTML = `<input type = "text" id = "numero[${index}]" size = '5' readonly value = ${item.numero}></input>`;
        let fecha = row.insertCell(2);
        fecha.innerHTML = `<input type = "text" id = "fecha[${index}]" size = '30' readonly value = ${item.fecha.substr(0, 10)}></input>`;
        let op = row.insertCell(3);
        op.innerHTML = `<a  onClick= "detalles(${index})"><i class= "fa fa-id-badge"></i><span>detalles</span></a><a onClick="Borrar(${index})"><i class="fas fa-trash-alt"></i><span>Borrar</span></a>`


    });

    is.forEach((item, index) => {

        document.getElementById(`name[${index}]`).value =
            document.getElementById(`name[${index}]`).defaultValue = item.cliente;

        let date = document.getElementById(`fecha[${index}]`).value;
        const fd = date.slice(0, 4);
        const md = date.slice(5, 7);
        const ld = date.slice(8, 10);
        date = `${ld}` + '-' + `${md}` + '-' + `${fd}`;

        document.getElementById(`fecha[${index}]`).value =
            document.getElementById(`fecha[${index}]`).defaultValue = date;

    });
}

*/