 console.log("certificado.js OK");
  const API_BASE = `http://${window.location.hostname}:8081`

  async function cargarListaCertificados() {
  const tbody = document.querySelector("#tablaCerts tbody");
  const msg = document.getElementById("msgLista");
  tbody.innerHTML = "";
  msg.textContent = "Cargando...";

  try {
    const resp = await fetch("http://localhost:8081/calibraciones/calibracion"); // ajustá tu base URL
    const data = await resp.json();

    if (!data.ok) throw new Error(data.error || "Error listando");

    const items = data.items || [];

    if (!items.length) {
      msg.textContent = "No hay certificados guardados.";
      return;
    }

    msg.textContent = "";

    items.forEach((c) => {
      const tr = document.createElement("tr");

      const fecha = c.fecha ? new Date(c.fecha).toLocaleDateString() : "";

      tr.innerHTML = `
        <td>${c.numero ?? ""}</td>
        <td>${c.cliente ?? ""}</td>
        <td>${fecha}</td>
        <td>
          <button class="btnVerPdf" data-id="${c._id}">Ver PDF</button>
           
        </td>
      `;

      tbody.appendChild(tr);
    });

    

    // Delegación de eventos (un solo listener)
    tbody.addEventListener("click", async (e) => {
      const btn = e.target.closest(".btnVerPdf");
      if (!btn) return;

      const id = btn.dataset.id;
      console.log("ID:", id, "type", typeof id);

      try{
        const resp = await fetch( `${API_BASE}/calibraciones/calibracion/${id}`);
        const data = await resp.json();
        console.log("data", data);
        if (!data.ok){ alert("No se pudo cargar el certificado");
        return;
        }

      //guardar certificado
      sessionStorage.setItem("cert_pdf", JSON.stringify(data.cert));
    
      window.open("./cert_pdf.html", "_blank");
    }catch (err) {
      console.error(err);
      alert("Error al obtener certificado");
    }
  });

  } catch (err) {
    msg.textContent = "Error: " + err.message;
  }
  
}
document.addEventListener("DOMContentLoaded", () => {
  cargarListaCertificados();
});

