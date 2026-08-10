

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

alert("1 - QRCODE.JS cargado");

document.addEventListener("DOMContentLoaded", () => {

  alert("2 - DOMContentLoaded ejecutado");

  if(!reader) {
    alert("3 - reader no encontrado");
    return;
  }

  alert("3 - reader encontrado"); 

  if(typeof reader !== "undefined") {
    alert("ERROR: html5qrcodeScanner NO esta definido");
    return;
  }  

  alert("4 - html5qrcodeScanne cargado");
    


  let qrProcesado = false;

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

      window.location.assign = ("/vistas/informe.html?" + params.toString());


    

/*    sessionStorage.setItem("qr_equipo", JSON.stringify(data)); */

    };

    let scanner;

    try {
      scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 300, height: 300 },
          rememberLastUsedCamera: true,
        },
        false
      );
      alert("5 - Scanner creado");
      scanner.render(onScanSuccess);
      alert("6 - scanner.render ejecutado");
    } catch (error) {
      
      alert("Error initializing scanner: " + error.message);
    };

});