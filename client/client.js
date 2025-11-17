// client/client.js
const fs = require("fs");
const path = require("path");
const https = require("https");
const axios = require("axios");

// Ruta absoluta a certs
const certsDir = path.join(__dirname, "..", "certs");
const caCert = fs.readFileSync(path.join(certsDir, "ca.crt"));
const clientPfx = fs.readFileSync(path.join(certsDir, "client.p12"));

async function callHttp() {
  console.log("=== Llamada HTTP ===");
  const res = await axios.get("http://localhost:3000/api/hello");
  console.log(res.data);
}

async function callHttps() {
  console.log("\n=== Llamada HTTPS (solo servidor) ===");
  const agent = new https.Agent({
    ca: caCert, // Confiamos en nuestra CA
  });

  const res = await axios.get("https://localhost:3443/api/hello", {
    httpsAgent: agent,
  });
  console.log(res.data);
}

async function callMtls() {
  console.log("\n=== Llamada HTTPS con mTLS ===");
  const agent = new https.Agent({
    ca: caCert,
    pfx: clientPfx,
    passphrase: "123456",
  });

  const res = await axios.get("https://localhost:3444/api/hello", {
    httpsAgent: agent,
  });
  console.log(res.data);
}

(async () => {
  try {
    await callHttp();
    await callHttps();
    await callMtls();
  } catch (err) {
    console.error("Error al consumir API:", err.message);
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Body:", err.response.data);
    }
  }
})();
