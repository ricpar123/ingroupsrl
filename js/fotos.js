
console.log("JS de fotos cargado correctamente.");

const fotosAntes = [];
const fotosDespues = [];

let modoActual = null; // "ANTES" | "DESPUES"

const btnAntes = document.getElementById("btnAntes");
const btnDespues = document.getElementById("btnDespues");
const btnCancelar = document.getElementById("btnCancelar");
const cameraInput = document.getElementById("cameraInput");

const previewAntes = document.getElementById("previewAntes");
const previewDespues = document.getElementById("previewDespues");
const fotoModal = document.getElementById("fotoModal");
const btnFotos = document.getElementById("btnFotos");

function abrirModal() {
  if (fotoModal) {
    fotoModal.classList.remove("hidden");
  } else {
    console.error("Error - fotoModal no existe");
  }
}

function cerrarModal() {
  if (fotoModal) {
    fotoModal.classList.add("hidden");
  } else {
    console.error("Error - fotoModal no existe");
  }
}

btnFotos?.addEventListener("click", abrirModal);

btnCancelar?.addEventListener("click", () => {
  modoActual = null;
  cerrarModal();
});

btnAntes?.addEventListener("click", () => {
  iniciarCaptura("ANTES");
});

btnDespues?.addEventListener("click", () => {
  iniciarCaptura("DESPUES");
});

function renderPreviews() {
  if (!previewAntes || !previewDespues) {
    console.error("No existen previewAntes o previewDespues en informe.html");
    return;
  }

  previewAntes.innerHTML = "";
  fotosAntes.forEach((file, i) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.alt = `Antes ${i + 1}`;
    previewAntes.appendChild(img);
  });

  previewDespues.innerHTML = "";
  fotosDespues.forEach((file, i) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.alt = `Despues ${i + 1}`;
    previewDespues.appendChild(img);
  });
}

function iniciarCaptura(modo) {
  modoActual = modo;

  if (modoActual === "ANTES" && fotosAntes.length >= 3) {
    alert("Has alcanzado el número máximo de fotos ANTES (3).");
    return;
  }

  if (modoActual === "DESPUES" && fotosDespues.length >= 3) {
    alert("Has alcanzado el número máximo de fotos DESPUÉS (3).");
    return;
  }

  cerrarModal();
  cameraInput.value = "";
  cameraInput.click();
}

cameraInput?.addEventListener("change", (e) => {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;

  if (modoActual === "ANTES") {
    if (fotosAntes.length + files.length > 3) {
      alert("Máximo 3 fotos ANTES.");
      cameraInput.value = "";
      return;
    }

    files.forEach(file => fotosAntes.push(file));
    console.log("fotosAntes:", fotosAntes);

  } else if (modoActual === "DESPUES") {
    if (fotosDespues.length + files.length > 3) {
      alert("Máximo 3 fotos DESPUÉS.");
      cameraInput.value = "";
      return;
    }

    files.forEach(file => fotosDespues.push(file));
    console.log("fotosDespues:", fotosDespues);

  } else {
    alert("Primero elige si la foto es ANTES o DESPUÉS.");
    return;
  }

  renderPreviews();
  cameraInput.value = "";
});

renderPreviews();









