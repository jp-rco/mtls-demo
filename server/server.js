// server/server.js
const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const express = require("express");

const app = express();
app.use(express.json());

// Ruta básica
app.get("/api/hello", (req, res) => {
  const clientAuthorized = req.socket.authorized || false;
  const clientCert = req.socket.getPeerCertificate
    ? req.socket.getPeerCertificate()
    : null;

  res.json({
    message: "Hola desde el servidor",
    mtlsAuthorized: clientAuthorized,
    clientSubject: clientCert && clientCert.subject ? clientCert.subject : null,
  });
});

// Puertos
const HTTP_PORT = 3000;
const HTTPS_PORT = 3443;
const MTLS_PORT = 3444;

// Ruta absoluta a la carpeta de certs
const certsDir = path.join(__dirname, "..", "certs");

// Cargar credenciales
const serverPfx = fs.readFileSync(path.join(certsDir, "server.p12"));
const caCert = fs.readFileSync(path.join(certsDir, "ca.crt"));

// --- Servidor HTTP ---
http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`HTTP escuchando en   http://localhost:${HTTP_PORT}/api/hello`);
});

// --- Servidor HTTPS (solo certificado de servidor) ---
https
  .createServer(
    {
      pfx: serverPfx,
      passphrase: "123456",
      // Aquí NO solicitamos certificado de cliente
      requestCert: false,
      rejectUnauthorized: false,
    },
    app
  )
  .listen(HTTPS_PORT, () => {
    console.log(
      `HTTPS (1-way TLS) escuchando en https://localhost:${HTTPS_PORT}/api/hello`
    );
  });

// --- Servidor HTTPS con mTLS ---
https
  .createServer(
    {
      pfx: serverPfx,
      passphrase: "123456",
      requestCert: true, // Pedir certificado de cliente
      rejectUnauthorized: true, // Rechazar si no está firmado por nuestra CA
      ca: caCert,
    },
    app
  )
  .listen(MTLS_PORT, () => {
    console.log(
      `mTLS (2-way TLS) escuchando en https://localhost:${MTLS_PORT}/api/hello`
    );
  });
