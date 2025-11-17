# Proyecto: Implementación de mTLS entre dos APIs en Node.js  
### Integrantes  
- Juan Pablo Restrepo  
- Andrés Ricaurte  

---

## 1. Introducción

Este proyecto implementa un entorno práctico para demostrar el funcionamiento de mTLS (Mutual TLS) entre dos APIs independientes desarrolladas en Node.js. El objetivo principal es crear un escenario donde un servicio actúe como servidor y otro como cliente, estableciendo comunicación mediante HTTP, HTTPS y mTLS.

El desarrollo cumple con los requerimientos solicitados:
1. Dos APIs separadas.
2. Comunicación por HTTP.
3. Comunicación por HTTPS (solo autenticación del servidor).
4. Comunicación por mTLS (autenticación mutua).
5. Uso de certificados generados manualmente, incluyendo archivos .p12.

---

## 2. Estructura del proyecto

```

mtls-demo/
certs/
server/
client/

```

### certs/
Contiene todos los certificados generados mediante OpenSSL:
- `ca.key`, `ca.crt`: Autoridad certificadora.
- `server.key`, `server.crt`, `server.p12`: Certificados del servidor.
- `client.key`, `client.crt`, `client.p12`: Certificados del cliente.

### server/
Contiene la API del servidor. Expone una ruta principal (`/api/hello`) accesible por HTTP, HTTPS y mTLS.

### client/
Contiene la API cliente. Su función es consumir el servidor utilizando las tres modalidades de comunicación.

---

## 3. Certificados generados

Se utilizó OpenSSL para generar:

- Una autoridad certificadora propia (`ca.crt`).
- Certificados firmados para el servidor y el cliente.
- Archivos `.p12` para su uso en Node.js, protegidos con contraseña.

Estos certificados permiten realizar tanto conexiones HTTPS estándar como autenticación mutua en mTLS.

---

## 4. API del servidor (server/)

La API del servidor está implementada en `server.js` con Express y corre como un proceso independiente.

El endpoint expuesto es:

```

GET /api/hello

```

Este mismo endpoint funciona con tres tipos de servidores:

### HTTP (puerto 3000)
Conexión sin cifrado, utilizada para la primera prueba.

### HTTPS (puerto 3443)
Cifrado TLS con certificado del servidor. El cliente solo valida la firma del servidor.

### mTLS (puerto 3444)
Autenticación mutua:
- El cliente envía su certificado (`client.p12`).
- El servidor verifica que esté firmado por la CA local.
- Se valida la identidad del cliente antes de responder.

---

## 5. API del cliente (client/)

Este servicio es un proceso Node.js independiente cuya función es consumir la API del servidor.  
El archivo principal es `client.js`.

Implementa tres funciones de prueba:

1. **callHttp**: realiza una solicitud simple a `http://localhost:3000/api/hello`.
2. **callHttps**: realiza una solicitud HTTPS validando únicamente el certificado del servidor.
3. **callMtls**: realiza una conexión mTLS enviando el certificado del cliente y validando a su vez el certificado del servidor.

El cliente se ejecuta con su propio `npm start`, demostrando que es un servicio completamente separado del servidor.

---

## 6. Ejecución del proyecto

### 6.1 Iniciar la API del servidor

Ruta:
```

mtls-demo/server

```

Comando:
```

npm start

```

El servidor queda escuchando en:
- `http://localhost:3000/api/hello`
- `https://localhost:3443/api/hello`
- `https://localhost:3444/api/hello`

### 6.2 Iniciar la API cliente

En otra terminal:

Ruta:
```

mtls-demo/client

```

Comando:
```

npm start

```

El cliente ejecutará sucesivamente las tres pruebas: HTTP, HTTPS y mTLS.

---

## 7. Validación de los requisitos solicitados

### a. Dos APIs separadas
- La API del servidor se encuentra en `server/` con su propio `package.json`.
- La API cliente se encuentra en `client/` y se ejecuta de forma independiente.  
Cada una corre en un proceso separado.

### b. Comunicación por HTTP
El cliente realiza una petición al servidor en el puerto 3000.

### c. Comunicación por HTTPS
El servidor utiliza `server.p12` y la CA para firmar.  
El cliente valida el certificado del servidor mediante `ca.crt`.

### d. Comunicación por mTLS
El servidor requiere certificado de cliente en el puerto 3444.  
El cliente envía `client.p12` y genera autenticación mutua.  
El servidor muestra en la respuesta la información del certificado recibido.

### e. Certificados en formato .p12
Tanto el servidor como el cliente usan archivos `.p12` generados con OpenSSL, cumpliendo el requerimiento específico del formato.

---

## 8. Conclusión

El proyecto demuestra el uso completo de HTTP, HTTPS y mTLS entre dos APIs reales y separadas en Node.js.  
La implementación cubre todos los requerimientos solicitados, utilizando certificados generados manualmente y procesos independientes para cliente y servidor.

La estructura del proyecto permite observar de manera clara cómo funciona tanto el cifrado TLS tradicional como el mecanismo de autenticación mutua mediante certificados digitales.