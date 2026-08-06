let usuarios = [];
let clientes = [];
let fotosAntes = [];
let fotosDespues = [];


async function fetchUsuarios(){
   
    const res = await fetch('http://localhost:8081/usuarios/tabla', 
        {
            method: "GET",
            headers: {"auth": "auth"}
            });
    

   
    
    if(!res.ok){
        const msg = `error en fetchUsuarios:, ${res.status}`;
        throw new Error(msg);
    }

    
    
    res.json()
    .then(data => {
        console.log('data', data);
        usuarios = data.usuarios;
        console.log('lista:', usuarios);

    

        var select = document.getElementById("tecnicoSelect");
    
    

        usuarios.forEach((item, index)=>{
        var option = document.createElement("option");
        option.text = item.userid;
        select.add(option);
       

        });


    

    });

}
    fetchUsuarios();

    

    const btnAgregarTecnico = document.getElementById("btnAgregarTecnico");
    const listaTecnicos = document.getElementById("listaTecnicos");

    const tecnicosSeleccionados = [];

    btnAgregarTecnico.addEventListener("click", () => {
        

    const tecnico = tecnicoSelect.value;

    console.log("tecnico select:", tecnico);

    if (!tecnico) return;

    if (tecnicosSeleccionados.includes(tecnico)) {
        alert("El técnico ya fue agregado");
        return;
    }

    tecnicosSeleccionados.push(tecnico);

    renderTecnicos();

});

//Nuevo Tecnico

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

function renderTecnicos() {

    listaTecnicos.innerHTML = "";

    tecnicosSeleccionados.forEach((tecnico, index) => {

        const badge = document.createElement("span");

        badge.className =
            "badge bg-primary tecnico-badge me-2";

        badge.innerHTML = `
            ${tecnico}
            <button
                type="button"
                class="btn-close btn-close-white ms-2"
                data-index="${index}">
            </button>
        `;

        listaTecnicos.appendChild(badge);

    });

}

async function fetchClientes(){
   
    const res = await fetch('http://localhost:8081/clientes', 
        {
            method: "GET",
            headers: {"auth": "auth"}
            });
    

   
    
    if(!res.ok){
        const msg = `error en fetchClientes:, ${res.status}`;
        throw new Error(msg);
    }

    
    
    res.json()
    .then(data => {
        console.log('data', data);
        clientes = data.listaClientes;
        console.log('lista:', clientes);

    

        var select = document.getElementById("clienteSelect");
    
    

        clientes.forEach((item, index)=>{
        var option = document.createElement("option");
        option.text = item.nombre;
        select.add(option);
       

        });


    

    });

}

    fetchClientes();

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

    /*Agregar Tecnico nuevo*/


    // Lógica para la Firma Digital
            

                

                const canvasCliente = document.getElementById("firmaClienteCanvas");
                const canvasTecnico = document.getElementById("firmaTecnicoCanvas");

                

                const inputFirmaCliente = document.getElementById("firmaClienteBase64");
                const inputFirmaTecnico = document.getElementById("firmaTecnicoBase64");

                const btnLimpiarCliente = document.getElementById("btnLimpiarFirmaCliente");
                const btnLimpiarTecnico = document.getElementById("btnLimpiarFirmaTecnico");
               

                // Clase nativa para controlar los Canvas de firma sin librerías externas

                class FirmaNativa {
                    constructor(canvasId, inputOcultoId, botonLimpiarId) {
                        this.canvas = document.getElementById(canvasId);
                        this.inputOculto = document.getElementById(inputOcultoId);
                        this.botonLimpiar = document.getElementById(botonLimpiarId);
                        this.ctx = this.canvas.getContext('2d');
                        this.dibujando = false;

                        this.inicializar();

                    }

                    inicializar() {
                        if (!this.canvas) return;

                        // Fijamos una resolución interna fija y alta (adiós problemas de redimensionamiento)
                        this.canvas.width = 800;
                        this.canvas.height = 400;

                        // Configuración del trazo
                        this.ctx.lineWidth = 3;
                        this.ctx.lineCap = 'round';
                        this.ctx.strokeStyle = '#000000'; // Color negro para la firma

                        // Eventos para Mouse (PC)
                        this.canvas.addEventListener('mousedown', (e) => this.iniciarDibujo(e));
                        this.canvas.addEventListener('mousemove', (e) => this.dibujar(e));
                        window.addEventListener('mouseup', () => this.detenerDibujo());

                        // Eventos para Pantallas Táctiles (Móviles/Tablets)
                        this.canvas.addEventListener('touchstart', (e) => this.iniciarDibujo(e));
                        this.canvas.addEventListener('touchmove', (e) => this.dibujar(e));
                        window.addEventListener('touchend', () => this.detenerDibujo());

                        // Evento para el botón Limpiar
                        if (this.botonLimpiar) {
                            this.botonLimpiar.addEventListener('click', () => this.limpiar());
                        }
                    }

                    obtenerCoordenadas(e) {
                        const rect = this.canvas.getBoundingClientRect();
        
                        // Detecta si es un evento táctil o de mouse
                        const clienteX = e.touches ? e.touches[0].clientX : e.clientX;
                        const clienteY = e.touches ? e.touches[0].clientY : e.clientY;

                        // Mapea la posición de la pantalla a la resolución interna de 800x400
                        return {
                            x: ((clienteX - rect.left) / rect.width) * this.canvas.width,
                            y: ((clienteY - rect.top) / rect.height) * this.canvas.height
                        };
                    }

                    iniciarDibujo(e) {
                        if (e.touches) e.preventDefault(); // Evita scroll en móviles
                        this.dibujando = true;
                        const coords = this.obtenerCoordenadas(e);
                        this.ctx.beginPath();
                        this.ctx.moveTo(coords.x, coords.y);
                    }

                    dibujar(e) {
                        if (!this.dibujando) return;
                        if (e.touches) e.preventDefault();
                        
                        const coords = this.obtenerCoordenadas(e);
                        this.ctx.lineTo(coords.x, coords.y);
                        this.ctx.stroke();
                    }

                    detenerDibujo() {
                        if (this.dibujando) {
                            this.dibujando = false;
                            // Guardamos el resultado en el input para la validación 'required'
                            this.inputOculto.value = this.canvas.toDataURL();
                            // Le avisamos a Bootstrap que el campo cambió y ya es válido
                            this.inputOculto.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }

                    limpiar() {
                        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        this.inputOculto.value = ''; // Vaciamos el input para que vuelva a ser requerido
                        this.inputOculto.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }

                    // Inicializamos ambas firmas al cargar el documento de forma local
                    window.addEventListener('DOMContentLoaded', () => {
                        new FirmaNativa('firmaClienteCanvas', 'firmaClientebase64', 'btnLimpiarFirmaCliente');
                        new FirmaNativa('firmaTecnicoCanvas', 'firmaTecnicobase64', 'btnLimpiarFirmaTecnico');
                    });
                

            

                

            //Fotos

            
            document
                .getElementById("btnFotoAntes")
                .addEventListener("click", () => {
                    if(fotosAntes.length >= 3) {
                        allert("Maximo 3 fotos Antes");
                        return;
                    }
                    document
                        .getElementById("fotoAntesInput")
                        .click();
                });
            
                document
                .getElementById("btnFotoDespues")
                .addEventListener("click", () => {
                    if(fotosDespues.length >= 3) {
                        allert("Maximo 3 fotos Despues");
                        return;
                    }
                    document
                        .getElementById("fotoDespuesInput")
                        .click();
                });
            
                document
                    .getElementById("fotoAntesInput")
                    .addEventListener("change", async function (){
                        const archivo = this.files[0];
                        if(!archivo) return;
                        const base64 = await comprimirImagen(archivo, 1200, 0.7);
                        fotosAntes.push(base64);

                        renderFotos(
                            fotosAntes,
                            "previewAntes"
                        );
                        this.value = "";
                    });

                 document
                    .getElementById("fotoDespuesInput")
                    .addEventListener("change", async function (){
                        const archivo = this.files[0];
                        if(!archivo) return;
                        const base64 = await comprimirImagen(archivo, 1200, 0.7);
                        fotosDespues.push(base64);

                        renderFotos(
                            fotosDespues,
                            "previewDespues"
                        );
                        this.value = "";
                    });

                    //Compresion de imagenes
    function comprimirImagen(file, maxWidth = 1200, calidad = 0.7) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);

                    const base64 = canvas.toDataURL("image/jpeg", calidad);
                    console.log("base64:", base64.substring(0,50));
                    console.log("fotosAntes:", fotosAntes.length);

                    resolve(base64);
                };

                    img.onerror = reject;
                    img.src = e.target.result;
            };

                    reader.onerror = reject;
                    reader.readAsDataURL(file);
        });
    }

    
                  

               /*Mostrar Miniaturas*/

                function renderFotos(array, contenedorId) {

                    const contenedor = document.getElementById(contenedorId);

                    contenedor.innerHTML = "";

                    array.forEach((foto, index) => {

                        const div = document.createElement("div");

                         div.className = "col-4";

                            div.innerHTML = `
                                <div class="card">

                                    <img
                                        src="${foto}"
                                        class="card-img-top foto-miniatura">

                                        <button
                                            class="btn btn-danger btn-sm w-100"
                                            onclick="eliminarFoto('${contenedorId}', ${index})">

                                                     X

                                        </button>

                                </div>

                            `;

                            contenedor.appendChild(div);
                    });
                }

                // Eliminar Foto 

            function eliminarFoto(tipo, index) {

                if (tipo === "previewAntes") {

                    fotosAntes.splice(index, 1);

                    renderFotos(
                        fotosAntes,
                        "previewAntes"
                    );

                }

                if (tipo === "previewDespues") {

                    fotosDespues.splice(index, 1);

                    renderFotos(
                        fotosDespues,
                        "previewDespues"
                    );

                }

            } 
        let resizeTimeout;

    function ajustarResolucionCanvas () {
        const canvasTecnico = document.getElementById("firmaTecnicoCanvas");
        const canvasCliente = document.getElementById("firmaClienteCanvas");

        if(!canvasTecnico || !canvasCliente) return;

        // 1. Guardamos los trazos actuales
        const contenidoTecnico = canvasTecnico.toDataURL();
        const contenidoCliente = canvasCliente.toDataURL();

        // 2. Sincronizamos los píxeles internos con el tamaño exacto del CSS
        canvasTecnico.width = canvasTecnico.clientWidth;
        canvasTecnico.height = canvasTecnico.clientHeight;

        canvasCliente.width = canvasCliente.clientWidth;
        canvasCliente.height = canvasCliente.clientHeight;

        // 3. Volvemos a pintar las firmas de forma limpia
        const imgTecnico = new Image();
        imgTecnico.src = contenidoTecnico;
        imgTecnico.onload = () => {
            const ctx = canvasTecnico.getContext('2d');
            ctx.drawImage(imgTecnico, 0, 0, canvasTecnico.width, canvasTecnico.height)
        };

        const imgCliente = new Image();
        imgCliente.src = contenidoCliente;
        imgCliente.onload = () => {
            const ctx = canvasCliente.getContext('2d');
            ctx.drawImage(imgCliente, 0, 0, canvasCliente.width, canvasCliente.height);
        };

    }

// Ejecuta la calibración al cargar la página por primera vez
window.addEventListener('load', ajustarResolucionCanvas);

// Monitorea cambios de tamaño en tiempo real (Herramientas de desarrollo, giros de pantalla, etc.)
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(ajustarResolucionCanvas, 150);
});


    //Envio de datos e imagenes al servidor y cloudinary

    const form = document.getElementById("formInforme");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            e.stopPropagation(); // evita que el evento se propage
        
            form.classList.add('was-validated');
            console.log("Formulario NO valido segun Bootstrap");
            return;
        }
        form.classList.remove("was-validate");
        console.log("Todo correcto! Procesando payload");
        
       

        const payload = {
        tecnicos: tecnicosSeleccionados || [],
        cliente : document.getElementById("clienteSelect").value,
        equipo : document.getElementById("equipo").value,
        marca: document.getElementById("marca").value,
        modelo: document.getElementById("modelo").value,
        nroSerie: document.getElementById("serie").value,

        motivoVisita: document.getElementById("motivoVisita").value,
        tipoTrabajo: document.getElementById("tipoTrabajo").value,
        presupuesto: document.getElementById("presupuesto").value,

        fechaInicio: document.getElementById("fechaInicio").value,
        fechaFin: document.getElementById("fechaTermino").value,
        horaInicio: document.getElementById("horaInicio").value,
        horaFin: document.getElementById("horaTermino").value,

        servicio: document.getElementById("servicio").value,
        obs: document.getElementById("observaciones").value,

        recibido: document.getElementById("recibido").value,
        status: document.getElementById("status").value,
        repuestos: document.getElementById("repuestos").value,

        firma: document.getElementById("firmaClientebase64").value,
        firmaT: document.getElementById("firmaTecnicobase64").value,

        fotosAntes: fotosAntes || [],
        fotosDespues: fotosDespues || []
        
        }

        console.log("Peso Payload:", (JSON.stringify(payload).length /1024 / 1024).toFixed(2), "MB");

        
        
        async function guardarInforme(payload) {
            if(!payload){console.error("payload null"); return;}
           try {
                const res = await fetch("http://localhost:8081/informes/informe", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    "auth": "auth"
                    },
                    body: JSON.stringify(payload)
                
                });
                //console.log("datos enviados:", JSON.stringify(payload));
                const data = await res.json();
                console.log("Respuesta completa", data);
                console.log("correo:", data.resultado.correo.correo);
                                

                if(!res.ok || !data.ok){
                  throw new Error(
                        data.mensaje ||
                        data.msg ||
                        "No se pudo guardar el informe"
                    );  
                }

                const correo = data.resultado.correo.correo;
                

                let mensaje = [];

                mensaje = 
                "✅ Informe guardado correctamente.\n" +
                "✅ Fotos subidas a Cloudinary correctamente.\n" +
                "✅ PDF generado correctamente.\n";

                if(!correo){
                    mensaje +=
                    "⚠️ No se recibió información sobre el envío de los correos.";
                }

                else if(correo.estado === "exito"){
                    mensaje +=
                    "✅ Correos validados y aceptados por el servidor para su envío.";

                    /*
                     * Aunque el envío sea exitoso, puede haber direcciones
                     * descartadas previamente por mails.so.
                     */
                    if(correo.emailsInValidos?.length > 0){
                        mensaje +=
                        "\n\n⚠️ No se envió a estas direcciones inválidas:";

                        correo.emailsInValidos.forEach(item => {
                            mensaje +=
                            `\n❌ ${item.email}` +
                            `\n   Motivo: ${item.motivo}`;
                        });

                        mensaje +=
                        "\n\nINGROUP recibió una copia y podrá reenviar el informe.";
                    }
                }

                else if(correo.estado === "parcial"){
                    mensaje +=
                    "⚠️ El informe se envió solamente a las direcciones válidas.\n";

                    correo.noValidos?.forEach(item => {
                        mensaje += `\n❌ ${item.email}\n${item.motivo}\n`;
                    });

                    correo.erroresValidacion?.forEach(item => {
                        mensaje += `\n⚠️ ${item.email}\n${item.motivo}\n`;
                    });

                    mensaje +=
                        "\nINGROUP recibió una copia y podrá reenviar el informe.";
                }

                else if(
                    correo.estado === "error_smtp" ||
                    correo.estado === "sin_destinatarios"
                ){
                        mensaje +=
                        `❌ ${correo.mensaje}\n` +
                        "El informe quedó almacenado correctamente.";
                  }

             alert(mensaje);

                

            } catch (error) {
                console.error("Error:", error);
                alert("No se pudo guardar el informe");
            } 
        }

        guardarInforme(payload);
        
    });

    