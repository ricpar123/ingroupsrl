

/* global Html5QrcodeScanner */

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
  let qrProcesado;

  const onScanSuccess = async (decodedText) => {
    alert("ENTRO EN onScanSuccess");
    if(qrProcesado) return;
    qrProcesado = true;

    alert("✅ QR LEÍDO: " + decodedText);  

    console.log("✅ QR LEÍDO:", decodedText);

    let data;
    try {
      data = parseQR(decodedText);
    } catch (e) {
      qrProcesado = false;
      alert(e.message);
      return;
    }

    alert(
        `✅ Cliente: ${data.cliente}\n` +
        `✅ Equipo: ${data.equipo}\n` +
        `✅ Marca: ${data.marca}\n` +
        `✅ Modelo: ${data.modelo}\n` +
        `✅ Serie: ${data.serie}`
    );

  
   

    const params = new URLSearchParams(data);

      try {
        await scanner.clear();
        console.log("Scanner cleared.");
        window.location.assign = ("/vistas/informe.html?" + params.toString());
      
      
      } catch (error) {
        console.error("Error clearing scanner:", error);
        window.location.assign = ("/vistas/informe.html?" + params.toString());
      };


    

/*    sessionStorage.setItem("qr_equipo", JSON.stringify(data)); */

    }

  const scanner = new Html5QrcodeScanner(
    "reader",
    {
      fps: 10,
      qrbox: { width: 300, height: 300 }, // 🔴 CLAVE
      rememberLastUsedCamera: true,
    },
    false
  );

  scanner.render(onScanSuccess);

});