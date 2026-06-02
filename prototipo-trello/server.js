import express from "express";
import path from "path";
import apiRoutes from "./server/routes/apiRoutes.js";

/**
 * SERVIDOR PRINCIPAL EXPRESS (server.js - PURO JAVASCRIPT)
 * 
 * Este archivo arranca el servidor Node.js y maneja:
 * 1. El parseo de datos JSON entrantes (POST/PUT).
 * 2. El enrutamiento lógico del patrón MVC conectándolo con la carpeta /api.
 * 3. El servicio de archivos frontend estáticos desde la carpeta /public.
 */
const app = express();
const PORT = 3000;

// Middleware para entender y leer formato JSON en las peticiones (req.body)
app.use(express.json());

// Middleware educativo para habilitar CORS (permite que herramientas como "Live Server" de VSCode en puerto 5500/5501 hagan peticiones al server de Node en puerto 3000)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Registrar las rutas de nuestra API (Controladores de nuestro patrón MVC)
app.use("/api", apiRoutes);

// Endpoint opcional de prueba para verificar estado
app.get("/api/saludo", (req, res) => {
  res.json({ mensaje: "¡Servidor de clases Node.js (Express) activo y corriendo!" });
});

// Servir la carpeta estática "public" (Frontend: index.html, main.js)
const publicPath = path.join(process.cwd(), "public");
app.use(express.static(publicPath));

// Cualquier otra ruta no capturada por la API servirá el index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Iniciamos la escucha del servidor en el puerto 3000
app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================================");
  console.log(` Servidor de Node.js Express corriendo en http://localhost:${PORT}`);
  console.log("=================================================");
});
