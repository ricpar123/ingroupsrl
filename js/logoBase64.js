const fs = require("fs");
const path = require("path");

const rutaLogo = path.join(__dirname, "..", "assets", "logoIngroup.png");

try {
  const buffer = fs.readFileSync(rutaLogo);
  const base64 = buffer.toString("base64");

  console.log("data:image/png;base64," + base64);
} catch (error) {
  console.error("Error leyendo el logo:", error.message);
}