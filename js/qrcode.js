

/* global Html5QrcodeScanner */

alert("0 - QRCODE.JS cargado");

function parseQR(texto) {
  const partes = texto
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  if (partes.length < 5) {
    throw new Error("QR inválido: deben ser 5 líneas");
  }

  return {
    cliente: partes[0],
    equipo: partes[1],
    marca: partes[2],
    modelo: partes[3],
    serie: partes[4],
  };

}

document.addEventListener("DOMContentLoaded", () => {

  alert("2 - DOMContentLoaded ejecutado");

  const reader = document.getElementById("reader");

  if(!reader) {
    alert("3 - reader no encontrado");
    return;
  }

  alert("3 - reader encontrado");

  if(typeof window.Html5QrcodeScanner === "undefined") {
    alert("ERROR: Html5QrcodeScanner NO está disponible");
    return;
  }

   let qrProcesado = false;

   let scanner;

    const onScanSuccess = async (decodedText) => {
     
      if(qrProcesado) return;
      qrProcesado = true;
      alert("1- ENTRO en onScanSuccess");
      
      alert("2 - decodedText recibido:\n" + decodedText);

      let data;
      try {
        alert("3 - antes de parseQR");
        data = parseQR(decodedText);
        alert("4 - parseQR terminado");
      } catch (error) {
        qrProcesado = false;
        alert(
          "ERROR EN parseQR:\n" +
            e.name + "\n" +
            e.message
        )
        return;
      }
        
      
      alert(
        `Cliente: ${data.cliente}\n` +
        `Equipo: ${data.equipo}\n` +
        `Marca: ${data.marca}\n` +
        `Modelo: ${data.modelo}\n` +
        `Serie: ${data.serie}`
      );

      const params = new URLSearchParams(data);

      const url =
        "/vistas/informe.html?" + params.toString();

      alert("Voy a navegar a:\n" + url);

      alert("datos a Informe:", data);

      window.location.assign(url);
    };

// CREAR EL SCANNER
scanner = new window.Html5QrcodeScanner(
    "reader",
    {
        fps: 10,
        qrbox: {
            width: 300,
            height: 300
        },
        rememberLastUsedCamera: true
    },
    false
);


// ACTIVARLO
scanner.render(onScanSuccess);


}); // fin DOMContentLoaded



      
        


     

    
 

    

    

 