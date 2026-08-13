
const API_BASE = "http://servering-production.up.railway.app";
const API_URL_PDF = "https://servering-production.up.railway.app/informes/pdf/informe/:id";


document.addEventListener("DOMContentLoaded", async () => {
    try {
        await fetchUsuarios();
        await fetchClientes();
        cargarDatosQR();

    } catch (error) {
        console.log("Error en cargarUsuarios y/o cargarClientes", error);
    }
});

function cargarDatosQR() {
    const params = new URLSearchParams(window.location.search);

    alert(
        `RECIBIDO EN INFORME:\n\n` +
        `Cliente: ${params.get("cliente")}\n` +
        `Equipo: ${params.get("equipo")}\n` +
        `Marca: ${params.get("marca")}\n` +
        `Modelo: ${params.get("modelo")}\n` +
        `Serie: ${params.get("serie")}`
    )
    
    const cliente = params.get("cliente");
    const equipo = params.get("equipo");
    const marca = params.get("marca");
    const modelo = params.get("modelo");
    const serie = params.get("serie");

    if (cliente) {
        document.getElementById("cliente").value = cliente;
    }

    if (equipo) {
        document.getElementById("equipo").value = equipo;
    }

    if (marca) {
        document.getElementById("marca").value = marca;
    }

    if (modelo) {
        document.getElementById("modelo").value = modelo;
    }

    if (serie) {
        document.getElementById("nroSerie").value = serie;
    }
}



const tecnicosSeleccionados = [];

function renderTecnicos() {
    const lista = document.getElementById("listaTecnicos");
    lista.innerHTML = "";

    tecnicosSeleccionados.forEach((tecnico, index) => {
        const badge = document.createElement("span");
        badge.className = "badge bg-primary me-2 mb-2 p-2";

        badge.innerHTML = `
        ${tecnico}
        <button
            type="button"
            class="btn-close btn-close-white ms-2"
            onclick="eliminarTecnico(${index})">
        </button>
        `;
        lista.appendChild(badge);
    });
}

function eliminarTecnico(index) {
    tecnicosSeleccionados.splice(index, 1);
    renderTecnicos();
}

document.getElementById("btnAgregarTecnico").addEventListener("click", () => {
  const select = document.getElementById("tecnicoSelect");
  const tecnico = select.value;

  if (!tecnico) return;

  if (tecnicosSeleccionados.includes(tecnico)) {
    alert("Ese técnico ya fue agregado");
    return;
  }

  tecnicosSeleccionados.push(tecnico);
  renderTecnicos();
});

document.getElementById("btnNuevoTecnico").addEventListener("click", async () => {
  const nombre = prompt("Ingrese el nombre del nuevo técnico:");

  if (!nombre || !nombre.trim()) return;

  const nuevoTecnico = nombre.trim();

  const select = document.getElementById("tecnicoSelect");

  const option = document.createElement("option");
  option.value = nuevoTecnico;
  option.textContent = nuevoTecnico;
  option.selected = true;

  select.appendChild(option);

  if (!tecnicosSeleccionados.includes(nuevoTecnico)) {
    tecnicosSeleccionados.push(nuevoTecnico);
    renderTecnicos();
  }

  // Opcional: guardar también en Mongo si tenés endpoint
});

async function fetchUsuarios(){
   alert("fetchUsuarios ejecutado");
    const res = await fetch(`${API_BASE}/usuarios`, 
        {
            method: "GET"
           
            });
    
    if(!res.ok){
        const msg = `error en fetchUsuarios:, ${res.status}`;
        throw new Error(msg);
    }

    res.json()
    .then(data => {
        alert('data', data);
        usuarios = data.usuarios;
        

        var select = document.getElementById("tecnicoSelect");
            usuarios.forEach((item, index) => {
            var option = document.createElement("option");
            option.text = item.userid;
            select.add(option);
        });

    });

}

fetchUsuarios();


async function fetchClientes(){
 
    const res = await fetch(`${API_BASE}/clientes`, 
        {
            method: "GET"
           
            });
    
    if(!res.ok){
        const msg = `error en fetchCientes:, ${res.status}`;
        throw new Error(msg);
    }

    res.json()
    .then(data => {
        
        clientes= data.listaClientes;
        
        var select = document.getElementById("clienteSelect");
            clientes.forEach((item, index) => {
            var option = document.createElement("option");
            option.text = item.nombre;
            select.add(option);
        });

    });
        
}  
    
//Funcion agregarCliente(si es que no existe en BD)

    document.getElementById("btnNuevoCliente").addEventListener("click", async () => {
        const nombre = prompt("Favor, ingrese el nombre del nuevo Cliente:");
        if(!nombre) return;
        const nombreCliente = nombre.trim();
        console.log("Nuevo Cliente:", nombreCliente);

        const option = document.createElement("option");
        option.value = nombreCliente;
        option.textContent = nombreCliente;
        option.selected = true;

        document.getElementById("clienteSelect").appendChild(option);
    });


function obtenerTecnicosSeleccionados() {
  const select = document.getElementById("tecnicoSelect");

  return Array.from(select.selectedOptions).map(opt => opt.value);
}


document.addEventListener("DOMContentLoaded", () => {
    const SignaturePad = window.SignaturePad;
    const canvas1 = document.getElementById("firmaClienteCanvas");
    const canvas2 = document.getElementById("firmaTecnicoCanvas");

    const signaturePad1 = new SignaturePad(canvas1, {
        backgroundColor: "rgba(255, 255, 255, 0)",
        penColor: "rgb(0, 0, 0)",
        minWidth: 0.5,
        maxWidth: 1.8
    });

    const signaturePad2 = new SignaturePad(canvas2, {
        backgroundColor: "rgba(255, 255, 255, 0)",
        penColor: "rgb(0, 0, 0)",
        minWidth: 0.5,
        maxWidth: 1.8
    });

    const btnLimpiarFirmaCliente = document.getElementById("btnLimpiarFirmaCliente");
    const btnLimpiarFirmaTecnico = document.getElementById("btnLimpiarFirmaTecnico");

    btnLimpiarFirmaCliente.addEventListener("click", () => {
        signaturePad1.clear();

    document.getElementById("firmaClientebase64").value = "";
    });

    btnLimpiarFirmaTecnico.addEventListener("click", () => {
        signaturePad2.clear();

    document.getElementById("firmaTecnicobase64").value = "";
    });


    window.signaturePad1 = signaturePad1;
    window.signaturePad2 = signaturePad2;

    // Ajustar el tamaño del canvas al cargar la página
    function resizeCanvas(canvas, signaturePad) {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        signaturePad.clear(); // Limpiar la firma al redimensionar
    }

    resizeCanvas(canvas1, signaturePad1);
    resizeCanvas(canvas2, signaturePad2);

    // 5) (Opcional) si el usuario rota el móvil o cambia tamaño
    window.addEventListener("resize", () => {
        resizeCanvas(canvas1, signaturePad1);
        resizeCanvas(canvas2, signaturePad2);
        console.log("resizeCanvas ejecutado");
    });
});     
    const canvas1 = document.getElementById("firmaClienteCanvas");
    const canvas2 = document.getElementById("firmaTecnicoCanvas");

    
         
    

   

// 5) (Opcional) si el usuario rota el móvil o cambia tamaño
/*
    window.addEventListener("resize", () => {
    resizeCanvas(canvas1, signaturePad1);
    resizeCanvas(canvas2, signaturePad2);
    console.log("resizeCnavas addEvenListenes resize ejecutado");
});
*/


    var formulario = document.getElementById("formInforme");

    formulario.addEventListener('submit', async (e) => {
        console.log('submit formulario');
        e.preventDefault();

    
        if(!formulario.checkValidity()){
            console.log("formulario invalido");
            formulario.reportValidity();
            return;
        }
        console.log("formulario válido");


        const nombreCliente = document.getElementById("cliente").value.trim();
        //obtenerEmailsCliente(nombreCliente);


        try {
            //cargar firmas antes de guardar
            document.getElementById("firma").value = 
            signaturePad1.isEmpty() ? "" : signaturePad1.toDataURL("image/png");

            document.getElementById("firmaT").value = 
            signaturePad2.isEmpty() ? "" : signaturePad2.toDataURL("image/png");
    
           const data = await guardarInforme();
           console.log("respuesta:", data); 

           if(!data.ok) { alert("No se pudo guardar el informe"); 
                return;
            }
            
           const informeId = data.informeId;
           console.log("Informe guardado con Id:", informeId);
           
           //subir imagenes, si existen
            const dataFotos = await subirImagenesInforme(informeId);
            console.log("Resultado subida de fotos:", dataFotos);

            alert(`Ìnforme ${data.numero} guardado correctamente`);

            //Abrir PDF pasando el id
           window.open(`${API_URL_PDF.replace(':id', informeId)}`, "_blank");
            

            //limpiar arrats y previews
            fotosAntes.length = 0;
            fotosDespues.length = 0;
            if(typeof renderPreviews === "function") { renderPreviews();}
        }
        
        
        catch (error) {
            console.error("Error en Submit:", error);
            alert("Error al guardar informe o subir imagenes");
        }

    });        
        

       async function guardarInforme(){

            const nombreCliente = document.getElementById("cliente").value.trim();

            //Primero se obtienen los emails
           // const emailsCliente = await obtenerEmailsCliente(nombreCliente);
            //    console.log("emails's Cliente:", emailsCliente);

        
            const payload = {
                cliente: nombreCliente,
                //emails: emailsCliente,
                tecnicos: obtenerTecnicosSeleccionados(),
                equipo: document.getElementById("equipo").value.trim(),
                marca: document.getElementById("marca").value.trim(),
                modelo: document.getElementById("modelo").value.trim(),
                serie: document.getElementById("serie").value.trim(),
                motivo: document.getElementById("motivo").value.trim(),
                tipoTrabajo: document.getElementById("tipoTrabajo").value.trim(),
                presupuesto: document.getElementById("presupuesto").value.trim(),
                horaInicio: document.getElementById("horaInicio").value.trim(),
                horaFin: document.getElementById("horaFin").value.trim(),
                fechaInicio: document.getElementById("inicio").value.trim(),
                fechaFin: document.getElementById("fin").value.trim(),
                //diasT: document.getElementById("diasT").value.trim(),
                servicio: document.getElementById("destrabajo").value.trim(),
                obs: document.getElementById("obs").value.trim(),
                recibido: document.getElementById("recibido").value.trim(),
                firma: signaturePad1.isEmpty() ? '' : signaturePad1.toDataURL('image/png'),
                firmaT: signaturePad2.isEmpty() ? '' : signaturePad2.toDataURL('image/png'),
                condicion: document.getElementById("condicion").value.trim(),
                repuestos: document.getElementById("repuestos").value.trim(),
                status: 'activo'
               
            
            };
            

            console.log("payload:", payload);
        

            const res = await fetch(`${API_BASE}/informes/informe`, {
                method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth": "auth"
                    },
                    body: JSON.stringify(payload)
            });

                console.log('datos enviados:', JSON.stringify(payload));

                const data = await res.json();
                console.log("Informe guardado:", data);
                console.log('ID del informe:', data.informeId);
                              
                
                 return data;

        } 
        
    async function subirUnaImagen(informeId,file, tipo, index) {
        console.log("estoy dentro de subirUnaImagen");

        
           const formData = new FormData();
                       
            formData.append(tipo, file, `${tipo}_${index + 1}.jpg`);
                      
        
            const res = await fetch(`${API_BASE}/informes/informe/${informeId}/imagenes`, {
            method: "POST",
                headers: {
                    "auth": "auth"
                },
            body: formData
        });
        const data = await res.json();
        
        if(!res.ok || !data.ok) {
            throw new Error(data.error || `Error subiendo ${tipo} ${index + 1}`);
        }
        console.log("subir una imagen:", data);
        return data;


        }
        
    async function subirImagenesInforme(informeId) {
        try {
            if(!informeId){ throw new Error("No se recibio informeId");

            }
            if(fotosAntes.length === 0 && fotosDespues.length === 0) {
                console.log("No hay fotos para subir");
                return { ok: true, links: []};
            }
            
            const resultados = [];

            for (let i = 0 ; i < fotosAntes.length; i++ ) {
                console.log(`Subiendo foto ANTES ${i+1}...` );
                const data = await subirUnaImagen(informeId, fotosAntes[i], "fotoAntes", i);
                console.log("estoy antes de resultados");
                resultados.push(data);
                console.log("foto antes:", data);
            }

            for (let i = 0 ; i < fotosDespues.length; i++ ) {
                console.log(`Subiendo foto DESPUES ${i+1}...` );
                const data = await subirUnaImagen(informeId, fotosDespues[i], "fotoDespues", i);
                resultados.push(data);
                console.log("foto despues:", data);
            }

            return {
                ok: true,
                resultados
            };
            
        }catch (error) {
            console.error("Error en subirImagenesInforme:", error);
            throw error;
        }
    }


    

        
    

