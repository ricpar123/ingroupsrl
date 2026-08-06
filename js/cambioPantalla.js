document.addEventListener("DOMContentLoaded", async () => {
  // (Opcional) si querés impedir acceso directo sin login:
  // const token = sessionStorage.getItem("token");
  // if (!token) return window.location.href = "/vistas/funcionarios.html";

  const result = await Swal.fire({
    title: "¿Dónde deseas ir?",
    text: "Elegí una pantalla para continuar.",
    icon: "question",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "qrcode.html",
    denyButtonText: "informe.html",
    cancelButtonText: "Cancelar",
    allowOutsideClick: false,
    allowEscapeKey: false,

    // clases para dar estilo + hover (las del <style>)
    customClass: {
      confirmButton: "btn-qrcode",
      denyButton: "btn-informe"
    }
  });

  if (result.isConfirmed) {
    window.location.href = "/vistas/qrcode.html";
  } else if (result.isDenied) {
    window.location.href = "/vistas/informe.html";
  } else {
    // Cancelar: volvemos al inicio o a donde quieras
    window.location.href = "/";
  }
});
