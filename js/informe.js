
const API_BASE = "https://servering-production.up.railway.app";
const API_URL_PDF = "https://servering-production.up.railway.app/informes/pdf/informe/:id";


function obtenerTecnicosSeleccionados() {
  const select = document.getElementById("tecnicoSelect");

  return Array.from(select.selectedOptions).map(opt => opt.value);
}

document.addEventListener("DOMContentLoaded", () => {
  const raw = sessionStorage.getItem("qr_equipo");
  if (!raw) return;

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    sessionStorage.removeItem("qr_equipo");
    return;
  }

  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el && value != null) el.value = value;
  };

  set("cliente", data.cliente);
  set("descripcion", data.descripcion);
  set("marca", data.marca);
  set("modelo", data.modelo);
  set("serie", data.serie);

  // usar una sola vez
  sessionStorage.removeItem("qr_equipo");
});

let usuarios = [];

async function fetchUsuarios(){
   
    const res = await fetch(API_BASE/usuarios, 
        {
            method: "GET",
            
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

        var select = document.getElementById("tecnicos");
            usuarios.forEach((item, index) => {
            var option = document.createElement("option");
            option.text = item.userid;
            select.add(option);
        });

    });

}

fetchUsuarios();

    
    
const wrapper1 = document.getElementById("signature1");
const canvas1 = wrapper1.querySelector("canvas");
    

const wrapper2 = document.getElementById("signature2");
const canvas2 = wrapper2.querySelector("canvas");

//Crear Signatures

const SignaturePad = window.SignaturePad;

const signaturePad1 = new SignaturePad(canvas1);
const signaturePad2 = new SignaturePad(canvas2);

    function resizeCanvas(wrapper, canvas, signaturePad) {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const rect = wrapper.getBoundingClientRect();
        const preWidth = canvas.width;
        const preHeight = canvas.height;
        // sino cambio realmente el tamaño, no hacer nada
        const nextWidth = Math.round(rect.width * ratio);
        const nextHeight = Math.round(rect.height * ratio);

        if(preWidth === nextWidth && preHeight === nextHeight) {
            return;
        }

        //guardar imagen actual antes de redimensionar
        let dataUrl = "";
        if(!signaturePad.isEmpty()) 
            { 
                dataUrl = signaturePad.toDataURL("image/png");

            }
            //Ajustar tamaño real del canvas
            canvas.width = nextWidth;
            canvas.height = nextHeight;
            //Ajustar tamaño visual tambien
            const ctx = canvas.getContext("2d");
            ctx.setTransform(1,0,0,1,0,0);
            ctx.scale(ratio, ratio);
            
            //Restaurar firma, si existia
            if (dataUrl) {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, rect.width, rect.height);
                };
                img.src = dataUrl;
            } else {
                signaturePad.clear();

            }

        
        console.log("resizeCanvas ejecutado");
    }

    window.addEventListener("load", () => {
    resizeCanvas(wrapper1, canvas1, signaturePad1);
    resizeCanvas(wrapper2, canvas2, signaturePad2);
    console.log("resizeCanvas addListenerLoad ejecutado");
});

// 5) (Opcional) si el usuario rota el móvil o cambia tamaño

    window.addEventListener("resize", () => {
    resizeCanvas(wrapper1, canvas1, signaturePad1);
    resizeCanvas(wrapper2, canvas2, signaturePad2);
    console.log("resizeCnavas addEvenListenes resize ejecutado");
});

// 6) Botones borrar (si usás onclick en HTML)
    window.signatureClear1 = () => {
    signaturePad1.clear();
    console.log("signatureClear ejecutado");
    };

    window.signatureClear2 = () => {
    signaturePad2.clear();

    };
/*
    let listaEmailsCliente = [];

    async function obtenerEmailsCliente(nombreCliente){
            try {
                if(!nombreCliente) return [];
                const res = await fetch(
                    `${API_BASE}/clientes/${encodeURIComponent(nombreCliente)}`,
                    {
                        method: "GET",
                        headers: {auth: "auth"}
                    }
                );

                const data = await res.json();
                console.log("cliente obtenido:", data);
                if(!res.ok || !data.ok || !data.cliente){

                    return [];
                }
                return Array.isArray(data.cliente.emails) ? data.cliente.emails : [];
            } catch (error) {
              console.log("Error obteniendo emails del Cliente", error); 
              return []; 
            }
        };
        
*/

    var formulario = document.getElementById("formulario");

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


    
});
        
    

