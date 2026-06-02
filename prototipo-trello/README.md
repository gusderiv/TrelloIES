

# proyecto diseñado con herramientas de inteligencia arfificial, estudio de mercado y material de apoyo para el estudio.

# Run and deploy your AI

This contains everything you need to run your app locally.



## Run Locally port 3000

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the [.env.local](.env.local) 
3. Run the app:
   `npm run dev`


# 📋 Prototipo Trello - Arquitectura Educativa M.V.C.

Este proyecto es un **prototipo funcional de un tablero Kanban estilo Trello Respetando los derechos de autor.*, diseñado especialmente con fines académicos para demostrar la implementación práctica del patrón de diseño **Modelo-Vista-Controlador (MVC)** utilizando un backend real en **Node.js con Express** y un frontend interactivo con **JavaScript  y CSS**.

---

## 🛠️ Tecnologías Utilizadas

*   **Backend (Servidor)**: Node.js, Express (Router, Middleware, Servidor Estático).
*   **Frontend (Cliente)**: HTML5 (Drag & Drop nativo), CSS (Tailwind vía CDN), JavaScript Vanilla (ES6+, Fetch API).
*   **Persistencia**: En memoria volátil (Ram Array en el servidor) simula el funcionamiento de una Base de Datos sin dependencias complejas.

---

## 📐 Estructura del Patrón M.V.C. en este Proyecto

El proyecto separa de forma estricta las responsabilidades para mantener un código limpio, modular y escalable:

```text
📁 Proyecto (Raíz)
│
├── 📁 server/                      # ◄ BACKEND (Lógica del Servidor)
│   ├── 📁 models/                  # 🧠 MODELOS (Gestión de Datos y Reglas)
│   │   ├── UserModel.js            # Contiene el estado de usuarios y validación de credenciales.
│   │   └── TaskModel.js            # Almacena el estado Kanban (columnas y tarjetas).
│   │
│   ├── 📁 controllers/             # 🎛️ CONTROLADORES (Orquestación y Enlace)
│   │   ├── AuthController.js       # Recibe solicitudes de Login y llama al modelo para validar.
│   │   └── TaskController.js       # Maneja lectura (GET), creación (POST), sincronización (PUT) y borrado (DELETE).
│   │
│   └── 📁 routes/                 # 🗺️ RUTAS (Despacho de endpoints API)
│       └── apiRoutes.js            # Vincula verbos HTTP (GET, POST, etc.) con sus controladores.
│
├── 📁 public/                      # ◄ FRONTEND (Interfaz Gráfica / VISTAS)
│   ├── index.html                  # Película/Plantilla visual principal.
│   └── main.js                     # Controlador de eventos DOM y llamadas fetch.
│
├── 📄 server.js                    # 🔌 Script de arranque Express
└── 📄 package.json                 # 📦 Dependencias y comandos npm
```
