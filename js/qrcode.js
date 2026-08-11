

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
    alert("ENTRO EN onScanSuccess");
    if(qrProcesado) return;
    qrProcesado = true;

    let data;
    try {
      data = parseQR(decodedText);
    } catch (e) {
      qrProcesado = false;
      alert(e.message);
      return;
    }

    const params = new URLSearchParams(data);

      try {
        await scanner.clear();
      
      } catch (error) {
        console.error("Error clearing scanner:", error);
        
      }

      window.location.assign = ("/vistas/informe.html?" + params.toString()
      );
    };


    scanner = new window.Html5QrcodeScanner(
    "reader",
    {
      fps: 10,
      qrbox: { width: 300, height: 300 },
      rememberLastUsedCamera: true,
    },
    false
  );

  scanner.render(onScanSuccess);

}); 

 

    

    

 