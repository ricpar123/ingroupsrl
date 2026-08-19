

alert("INFORME.JS NUEVO CARGADO");

const API_BASE = "http://localhost:8081";
const API_URL_PDF = "https://servering-production.up.railway.app/informes/pdf/informe/:id";


document.addEventListener("DOMContentLoaded", async () => {
    try {
        await fetchUsuarios();
        await fetchClientes();
        await inicializarFotos();
       // cargarDatosQR();

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

    alert("ANTES DE CREAR VARIABLES");
    
    const cliente = params.get("cliente");
    const equipo = params.get("equipo");
    const marca = params.get("marca");
    const modelo = params.get("modelo");
    const serie = params.get("serie");

    alert("VARIABLES CREADAS");
    
    alert(`CONFIRMACION
            Cliente: ${cliente}
            Equipo: ${equipo}
            Marca: ${marca}
            Modelo: ${modelo}
            Serie: ${serie}`);

    const campoCliente = document.getElementById("cliente");
    const campoEquipo = document.getElementById("equipo");
    const campoMarca = document.getElementById("marca");
    const campoModelo = document.getElementById("modelo");
    const campoSerie = document.getElementById("nroSerie");

    if (cliente) {
        document.getElementById("clienteSelect").value = cliente;
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
        document.getElementById("serie").value = serie;
    }
}

async function fetchUsuarios(){
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

 
});

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
    
function obtenerTecnicosSeleccionados() {
  const select = document.getElementById("tecnicoSelect");

  return Array.from(select.selectedOptions).map(opt => opt.value);
}

function inicializarFotos () {
    alert("Entro en inicializarFotos")
    const btnFotoAntes =
        document.getElementById("btnFotoAntes");

    const btnFotoDespues =
        document.getElementById("btnFotoDespues");

    const inputFotoAntes =
        document.getElementById("fotoAntesInput");

    const inputFotoDespues =
        document.getElementById("fotoDespuesInput");

    alert(
    `Fotos:\n` +
    `btnAntes: ${!!btnFotoAntes}\n` +
    `btnDespues: ${!!btnFotoDespues}\n` +
    `inputAntes: ${!!inputFotoAntes}\n` +
    `inputDespues: ${!!inputFotoDespues}`
    );

    btnFotoAntes?.addEventListener("click", () => {
        alert("CLICK FOTO ANTES");
        inputFotoAntes.click();
    });

    btnFotoDespues?.addEventListener("click", () => {
        alert("CLICK FOTO DESPUES");
        inputFotoDespues.click();
    });
}


document.addEventListener("DOMContentLoaded", async () => {
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

    var formulario = document.getElementById("formInforme");

    formulario.addEventListener('submit', async (e) => {
       
        e.preventDefault();

            //cargar firmas antes de guardar
            document.getElementById("firmaClientebase64").value = 
            signaturePad1.isEmpty() ? "" : signaturePad1.toDataURL("image/png");

            document.getElementById("firmaTecnicobase64").value = 
            signaturePad2.isEmpty() ? "" : signaturePad2.toDataURL("image/png");

    
        if(!formulario.checkValidity()){
            console.log("formulario invalido");
            formulario.reportValidity();
            return;
        }
        console.log("formulario válido");
    
        try {
            
    
           const data = await guardarInforme();
          

          
            
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
         
    

   

// 5) (Opcional) si el usuario rota el móvil o cambia tamaño
/*
    window.addEventListener("resize", () => {
    resizeCanvas(canvas1, signaturePad1);
    resizeCanvas(canvas2, signaturePad2);
    console.log("resizeCnavas addEvenListenes resize ejecutado");
});
*/


    


        async function guardarInforme(){

        const payload = {
            cliente: document.getElementById("clienteSelect").value.trim(),
             
            tecnicos: obtenerTecnicosSeleccionados(),
            equipo: document.getElementById("equipo").value.trim(),
            marca: document.getElementById("marca").value.trim(),
            modelo: document.getElementById("modelo").value.trim(),
            serie: document.getElementById("serie").value.trim(),
            motivo: document.getElementById("motivoVisita").value.trim(),
            tipoTrabajo: document.getElementById("tipoTrabajo").value.trim(),
            presupuesto: document.getElementById("presupuesto").value.trim(),
            horaInicio: document.getElementById("horaInicio").value.trim(),
            horaFin: document.getElementById("horaFin").value.trim(),
            fechaInicio: document.getElementById("fechaInicio").value.trim(),
            fechaFin: document.getElementById("fechaFin").value.trim(),
            servicio: document.getElementById("servicio").value.trim(),
            obs: document.getElementById("obs").value.trim(),
            recibido: document.getElementById("recibido").value.trim(),
            firma: signaturePad1.isEmpty() ? '' : signaturePad1.toDataURL('image/png'),
            firmaT: signaturePad2.isEmpty() ? '' : signaturePad2.toDataURL('image/png'),
            repuestos: document.getElementById("repuestos").value.trim(),
            status: document.getElementById("status").value.trim(),
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
                console.log("RESPUESTA COMPLETA:", data);

                const resultado = data.resultado;
                const informeGuardado = resultado.informeGuardado;
                const cloudinary = resultado.cloudinary;
                const pdf = resultado.pdf;
                const correo = resultado.correo.correo;
                const informe = resultado.informe; 

                console.log("Informe guardado:", informeGuardado);

                console.log("Cloudinary:", cloudinary.ok);

                console.log("PDF:", pdf.ok);

                console.log("Resultado correo:", correo);

                console.log("Número:", informe.numero);

                console.log("Cliente:", informe.cliente);

                console.log("ID:", informe.id);

                let mensaje = "";

            if (resultado.informeGuardado) {
                mensaje += "✅ Informe guardado correctamente.\n";
            }

            if (resultado.cloudinary?.ok) {
            mensaje += "✅ Fotos subidas a Cloudinary correctamente.\n";
            }

            if (resultado.pdf?.ok) {
            mensaje += "✅ PDF generado correctamente.\n";
            }

            if (correo?.estado === "exito") {
            mensaje += "✅ Correos enviados correctamente.\n";
            }

            alert(mensaje);
                              
          return data;      
                 
        
        } //fin guardarInforme()
        
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


    

        
    

