
document.getElementById('rangoMin').addEventListener('input', actualizarRangos);
document.getElementById('rangoMax').addEventListener('input', actualizarRangos);



function actualizarRangos() {

  const minRango = parseFloat(document.getElementById('rangoMin').value);
  const maxRango = parseFloat(document.getElementById('rangoMax').value);

  if (!Number.isFinite(minRango) || !Number.isFinite(maxRango)) {
    return; // si aún no están completos, no hacer nada
  }

  const step = ((maxRango - minRango)/2);
  const rangoMedio = step + minRango;
    document.querySelector('#head1 input').value = minRango.toFixed(2);
    document.querySelector("#head2 input").value = rangoMedio.toFixed(2);

    document.querySelector("#head3 input").value = maxRango.toFixed(2);  


}

actualizarRangos();






// Ejemplo de acceso a los valores de los inputs en la tabla
    const tabla = document.getElementById('miTabla');
    const inputs = tabla.querySelectorAll('input');


    
    inputs.forEach(input => {
      input.addEventListener('change', (e) => {
        console.log(`Nuevo valor: ${e.target.value}`);
      });
    });
    
    const canvas = document.getElementById("firmaCanvas");
    const wrap = canvas.parentElement;
    const ctx = canvas.getContext("2d");

    document.getElementById('rangoMin').addEventListener('input', actualizarRangos);
    document.getElementById('rangoMax').addEventListener('input', actualizarRangos);





actualizarRangos();



  // 🔥 Ajustar el tamaño REAL del canvas al tamaño CSS (y a la densidad de pantalla)
    function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width  = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    // Escalar el contexto para que 1 unidad = 1 px CSS
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Configuración de trazo (negro, visible)
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000";
  }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let drawing = false;
    let lastX = 0, lastY = 0;

    function getPos(e) {


    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
    }

  function start(e) {
    e.preventDefault();
    drawing = true;
    const p = getPos(e);
    lastX = p.x; lastY = p.y;
  }

  function move(e) {
    const rW = wrap.getBoundingClientRect();
    const rC = canvas.getBoundingClientRect();
    console.log("wrap:", rW.left, rW.top, rW.width, rW.height);
    console.log("canvas:", rC.left, rC.top, rC.width, rC.height);
    if (!drawing) return;
    e.preventDefault();
    const p = getPos(e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    lastX = p.x; lastY = p.y;
  }

  function end(e) {
    if (!drawing) return;
    e.preventDefault();
    drawing = false;
    guardarFirmaAuto();
  }

  // Mouse
  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);

  // Touch
  canvas.addEventListener("touchstart", start, { passive: false });
  canvas.addEventListener("touchmove", move, { passive: false });
  canvas.addEventListener("touchend", end);

  // Botones
    document.getElementById("btnLimpiarFirma").addEventListener("click", () => {
    // limpiar
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    document.getElementById("firmaBase64").value = "";
  });
  
  function guardarFirmaAuto() {
  const dataUrl = canvas.toDataURL("image/png");
  document.getElementById("firmaBase64").value = dataUrl;
  console.log("Firma auto-guardada:", dataUrl.slice(0, 30));
}
/*
    document.getElementById("btnGuardarFirma").addEventListener("click", () => {
    const dataUrl = canvas.toDataURL("image/png");
    document.getElementById("firmaBase64").value = dataUrl;
    console.log("Firma base64 OK (inicio):", dataUrl.slice(0, 40));
    alert("Firma lista ✅");
  });
*/
  function obtenerPuntosDesdeTablaNueva() {
  const nominales = [1,2,3].map(i => {
    const v = parseFloat(document.querySelector(`#head${i} input`)?.value);
    return Number.isFinite(v) ? v : NaN;
  });

  if (nominales.some(n => !Number.isFinite(n))) {
    throw new Error("Nominales incompletos");
  }

  // puntos: 3 puntos, cada uno con 5 mediciones
  const puntos = nominales.map(n => ({ nominal: n, mediciones: [] }));

  const filas = document.querySelectorAll("#miTabla tbody tr");

  filas.forEach(tr => {
    const tds = tr.querySelectorAll("td input");
    if (tds.length < 3) return;

    tds.forEach((inp, idx) => {
      const med = parseFloat(inp.value);
      if (Number.isFinite(med)) puntos[idx].mediciones.push(med);
    });
  });

  return puntos;
}

function calcularErroresGlobales(puntos) {

  let sumaErrores = 0;
  let sumaErroresPct = 0;
  let total = 0;

  puntos.forEach(punto => {

    const nominal = punto.nominal;

    punto.mediciones.forEach(medido => {

      const error = medido - nominal;   // con signo
      sumaErrores += error;

      const errorPct = (error / nominal) * 100;
      sumaErroresPct += errorPct;

      total++;
    });

  });

  if (total === 0) {
    throw new Error("No hay mediciones válidas");
  }

  const mediaErrorAbs = sumaErrores / total;       // Nm
  const mediaErrorPct = sumaErroresPct / total;    // %

  return {
    errorAbs: mediaErrorAbs,
    errorPct: mediaErrorPct
  };
}
