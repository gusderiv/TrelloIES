/**
 * LOGICA DEL CLIENTE (main.js - JAVASCRIPT VANILLA PURO)
 * 
 * Este script interactivo controla todos los clicks, drag & drop,
 * y peticiones fetch hacia los controladores del servidor Node.js Express.
 */

// Detectamos si el usuario abrió el index.html usando VSCode Live Server (generalmente puertos 5500 o 5501)
// en lugar del puerto 3000 de Node.js. Si es así, comunicamos el frontend con el backend en puerto 3000.
const isLiveServer = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && window.location.port !== "3000" && window.location.port !== "";
const API_BASE = isLiveServer ? "http://localhost:3000" : "";

// -----------------------------------------------------------------
// 1. OBTENCIÓN DE ELEMENTOS DEL DOM
// -----------------------------------------------------------------
const loginSecView = document.getElementById("loginSec-view");
const dashboardSecView = document.getElementById("dashboardSec-view");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
const loginErrorMsg = document.getElementById("login-error-msg");
const errorText = document.getElementById("error-text");
const kanbanContainer = document.getElementById("kanban-board-container");
const logoutBtn = document.getElementById("logout-btn");
const addListBtn = document.getElementById("add-list-btn");
const loggedUserName = document.getElementById("logged-user-name");

// -----------------------------------------------------------------
// 2. CONTROL SESIÓN: FORMULARIO DE INGRESO (LOGIN POST)
// -----------------------------------------------------------------
loginForm.addEventListener("submit", async function (evento) {
  evento.preventDefault(); // Impedir reinicio predeterminado de envío HTML

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  try {
    // Petición asíncrona hacia nuestro AuthController del MVC en Node.js
    const respuesta = await fetch(API_BASE + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password })
    });

    const respuestaJSON = await respuesta.json();

    if (respuestaJSON.success) {
      // Guardamos la sesión en el localStorage del navegador
      localStorage.setItem("username", username);
      loggedUserName.textContent = username;

      // Ocultar sección login y mostrar el panel del Kanban
      loginSecView.style.display = "none";
      dashboardSecView.style.display = "flex";

      // Cargamos los datos del tablero actuales
      cargarTablero();
    } else {
      // Credenciales erróneas devueltas por el servidor
      errorText.textContent = respuestaJSON.error || "Usuario o contraseña inválidos.";
      loginErrorMsg.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error al autenticar:", error);
    errorText.textContent = "Error de conexión: No se pudo conectar con el servidor Express en el puerto 3000.";
    loginErrorMsg.classList.remove("hidden");
  }
});

// Botón de salir / Cerrar sesión
logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("username");
  
  // Limpieza visual
  dashboardSecView.style.display = "none";
  loginSecView.style.display = "flex";
  
  loginForm.reset();
  loginErrorMsg.classList.add("hidden");
});

// Comprobar si el usuario ya tenía sesión activa asignada
const sesionLocal = localStorage.getItem("username");
if (sesionLocal) {
  loggedUserName.textContent = sesionLocal;
  loginSecView.style.display = "none";
  dashboardSecView.style.display = "flex";
  cargarTablero();
}

// -----------------------------------------------------------------
// 3. RECUPERAR DATOS DEL MODELO DE TAREAS (READ GET)
// -----------------------------------------------------------------
async function cargarTablero() {
  kanbanContainer.innerHTML = `
    <div class="flex items-center justify-center w-full h-full py-12">
      <p class="text-slate-500 font-mono text-xs animate-pulse">Obteniendo columnas y tareas desde Node.js...</p>
    </div>
  `;

  try {
    const resp = await fetch(API_BASE + "/api/tasks");
    const columnasData = await resp.json();

    kanbanContainer.innerHTML = ""; // Limpieza del contenedor

    // Creación en bucle de cada elemento visual mediante appendChild
    columnasData.forEach(function (columna) {
      crearColumnaVisual(columna.id, columna.titulo, columna.tarjetas);
    });
  } catch (err) {
    console.error("Error al cargar tablero:", err);
    kanbanContainer.innerHTML = `
      <div class="rounded-xl bg-red-950/20 p-6 border border-red-500/30 mx-auto max-w-lg my-12 text-center text-red-300 shadow-xl">
        <p class="text-sm font-bold">⚠️ Fallo de Conexión del Prototipo</p>
        <p class="text-xs mt-2 text-slate-400 leading-relaxed">
          Asegúrate de que el servidor está encendido ejecutando en tu terminal VSCode:<br>
          <code class="bg-red-950/40 text-red-400 px-2 py-1 rounded inline-block mt-2 font-mono">node server.js</code> <br>
          e ingresa en tu navegador web a: <code class="text-indigo-400 font-bold">http://localhost:3000</code> en lugar de abrir el archivo local.
        </p>
      </div>
    `;
  }
}

// -----------------------------------------------------------------
// 4. CREAR ELEMENTOS DEL KANBAN (DOM & EVENTOS DRAG & DROP)
// -----------------------------------------------------------------
function crearColumnaVisual(idCol, tituloCol, tarjetasArray) {
  // Div contenedor de la columna
  const colElement = document.createElement("div");
  colElement.classList.add(
    "columna-trello",
    "w-72",
    "bg-slate-900/90",
    "rounded-xl",
    "shadow-lg",
    "border",
    "border-slate-800/80",
    "p-4",
    "flex",
    "flex-col",
    "max-h-[75vh]",
    "shrink-0",
    "transition-all"
  );
  colElement.setAttribute("data-id", idCol);

  // Cabecera superior de la columna con el título y el botón borrar
  const headerDiv = document.createElement("div");
  headerDiv.classList.add("flex", "items-center", "justify-between", "mb-4", "pb-1");

  const tituloH3 = document.createElement("h3");
  tituloH3.classList.add("col-titulo", "text-xs", "font-bold", "text-slate-400", "tracking-wider", "uppercase");
  tituloH3.textContent = tituloCol;

  const btnEliminarCol = document.createElement("button");
  btnEliminarCol.classList.add(
    "text-slate-500",
    "hover:text-rose-400",
    "text-xs",
    "font-bold",
    "p-1",
    "rounded",
    "hover:bg-slate-800/60",
    "cursor-pointer",
    "transition-colors"
  );
  btnEliminarCol.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  `;
  btnEliminarCol.addEventListener("click", function () {
    if (confirm("¿Seguro que deseas eliminar la columna \"" + tituloCol + "\" con todas sus tareas?")) {
      colElement.remove();
      sincronizarTableroBackend();
    }
  });

  headerDiv.appendChild(tituloH3);
  headerDiv.appendChild(btnEliminarCol);
  colElement.appendChild(headerDiv);

  // Zona interactiva receptora DROP ZONE (el contenedor de las tarjetas)
  const dropZoneDiv = document.createElement("div");
  dropZoneDiv.classList.add(
    "contenedor-tarjetas-dropzone",
    "flex-1",
    "overflow-y-auto",
    "min-h-[150px]",
    "flex",
    "flex-col",
    "gap-2.5",
    "py-2",
    "px-1",
    "rounded-lg",
    "border-2",
    "border-dashed",
    "border-transparent",
    "transition-colors"
  );

  // Habilitar la recepción del evento drag & drop permitiendo la soltura
  dropZoneDiv.addEventListener("dragover", function (e) {
    e.preventDefault(); // IMPORTANTE de Node/Express: desbloquea el dropping
    dropZoneDiv.classList.add("zona-drop-activa");
  });

  dropZoneDiv.addEventListener("dragleave", function () {
    dropZoneDiv.classList.remove("zona-drop-activa");
  });

  dropZoneDiv.addEventListener("drop", async function (e) {
    e.preventDefault();
    dropZoneDiv.classList.remove("zona-drop-activa");

    if (e.dataTransfer) {
      // Reclamamos el ID de la tarjeta que venía viajando en memoria
      const idTarjeta = e.dataTransfer.getData("text/plain");
      const tarjetaDOMElem = document.getElementById(idTarjeta);

      if (tarjetaDOMElem) {
        // Enlazar de manera física el nodo con appendChild en la columna destino
        dropZoneDiv.appendChild(tarjetaDOMElem);

        // Actualizamos de inmediato en el backend por PUT sync
        await sincronizarTableroBackend();
      }
    }
  });

  // Renderizar e inyectar cada tarjeta inicial
  tarjetasArray.forEach(function (tarjetaObj) {
    const tarjetaVisual = crearTarjetaVisual(tarjetaObj);
    dropZoneDiv.appendChild(tarjetaVisual);
  });

  colElement.appendChild(dropZoneDiv);

  // Sección interior de pie para inserción de tarjetas individuales
  const footerAddDiv = document.createElement("div");
  footerAddDiv.classList.add("mt-3");

  const btnAnadirTarea = document.createElement("button");
  btnAnadirTarea.classList.add(
    "w-full",
    "text-left",
    "text-slate-400",
    "hover:text-indigo-400",
    "text-xs",
    "font-semibold",
    "flex",
    "items-center",
    "gap-1.5",
    "py-2",
    "px-2",
    "hover:bg-slate-800/80",
    "rounded-lg",
    "transition-colors",
    "cursor-pointer"
  );
  btnAnadirTarea.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-3.5 w-3.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
    Agregar una tarjeta
  `;

  // Formulario flotante de entrada de datos
  const formAddCard = document.createElement("form");
  formAddCard.classList.add("hidden", "space-y-2", "mt-1");

  const textareaVal = document.createElement("textarea");
  textareaVal.placeholder = "Escribe una tarea...";
  textareaVal.required = true;
  textareaVal.classList.add(
    "w-full",
    "text-xs",
    "p-2.5",
    "rounded-md",
    "border",
    "border-slate-700",
    "focus:border-indigo-500",
    "focus:ring-1",
    "focus:ring-indigo-500",
    "outline-none",
    "bg-slate-800",
    "resize-none",
    "text-white"
  );
  textareaVal.rows = 2;

  const btnControlsDiv = document.createElement("div");
  btnControlsDiv.classList.add("flex", "items-center", "gap-2");

  const btnConfirmBtn = document.createElement("button");
  btnConfirmBtn.type = "submit";
  btnConfirmBtn.classList.add(
    "bg-indigo-600",
    "text-white",
    "text-xs",
    "font-semibold",
    "px-3",
    "py-1.5",
    "rounded-md",
    "hover:bg-indigo-500",
    "cursor-pointer",
    "transition-colors"
  );
  btnConfirmBtn.textContent = "Añadir";

  const btnCancelBtn = document.createElement("button");
  btnCancelBtn.type = "button";
  btnCancelBtn.classList.add(
    "text-slate-400",
    "hover:text-slate-200",
    "text-xs",
    "font-semibold",
    "px-2",
    "py-1.5",
    "cursor-pointer",
    "transition-colors"
  );
  btnCancelBtn.textContent = "Cancelar";

  btnControlsDiv.appendChild(btnConfirmBtn);
  btnControlsDiv.appendChild(btnCancelBtn);
  formAddCard.appendChild(textareaVal);
  formAddCard.appendChild(btnControlsDiv);

  // Alternadores de visibilidad frontend
  btnAnadirTarea.addEventListener("click", function () {
    btnAnadirTarea.classList.add("hidden");
    formAddCard.classList.remove("hidden");
    textareaVal.focus();
  });

  btnCancelBtn.addEventListener("click", function () {
    formAddCard.classList.add("hidden");
    btnAnadirTarea.classList.remove("hidden");
    textareaVal.value = "";
  });

  formAddCard.addEventListener("submit", async function (eventoCard) {
    eventoCard.preventDefault();
    const contenidoStr = textareaVal.value.trim();
    if (!contenidoStr) return;

    try {
      // Envío POST al TaskController de Node (CREATE POST)
      const res = await fetch(API_BASE + "/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          columnaId: idCol,
          contenido: contenidoStr
        })
      });

      const dataResult = await res.json();

      if (dataResult.success) {
        // Añadir visualmente directo con appendChild
        const nuevoCardDOM = crearTarjetaVisual(dataResult.tarjeta);
        dropZoneDiv.appendChild(nuevoCardDOM);

        // Reset
        textareaVal.value = "";
        formAddCard.classList.add("hidden");
        btnAnadirTarea.classList.remove("hidden");
      }
    } catch (errCard) {
      console.error("Fallo al registrar tarea:", errCard);
    }
  });

  footerAddDiv.appendChild(btnAnadirTarea);
  footerAddDiv.appendChild(formAddCard);
  colElement.appendChild(footerAddDiv);

  // Añadir la columna completa al contenedor general del Kanban
  kanbanContainer.appendChild(colElement);
}

/**
 * Genera el elemento HTML visual para cada Tarjeta concreta,
 * asignándole el atributo Draggable="true" nativo y los eventos de arrastre.
 */
function crearTarjetaVisual(tarjetaObj) {
  const cardElem = document.createElement("div");
  cardElem.id = tarjetaObj.id;
  cardElem.setAttribute("draggable", "true"); // Requerimiento para poder ser arrastrada

  cardElem.classList.add(
    "tarjeta-trello",
    "bg-slate-900",
    "p-3.5",
    "rounded-lg",
    "shadow-sm",
    "border",
    "border-slate-800",
    "hover:border-slate-705",
    "cursor-grab",
    "active:cursor-grabbing",
    "transition-all",
    "flex",
    "justify-between",
    "items-start",
    "gap-2.5",
    "group"
  );

  const cardSpan = document.createElement("span");
  cardSpan.classList.add("tarjeta-texto", "text-xs", "text-slate-300", "font-medium", "break-words", "flex-1", "leading-relaxed");
  cardSpan.textContent = tarjetaObj.contenido;

  const btnBorrarCard = document.createElement("button");
  btnBorrarCard.classList.add(
    "text-slate-500",
    "hover:text-rose-400",
    "p-1",
    "rounded-md",
    "hover:bg-slate-850",
    "opacity-0",
    "group-hover:opacity-100",
    "transition-opacity",
    "transition-colors",
    "cursor-pointer"
  );
  btnBorrarCard.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  `;

  // Borrado de tarjeta (DELETE API)
  btnBorrarCard.addEventListener("click", async function (ev) {
    ev.stopPropagation(); // Prevenir interferencia con el arrastre
    if (confirm("¿Seguro que quieres borrar esta tarea: \"" + tarjetaObj.contenido + "\"?")) {
      try {
        const respuestaDelete = await fetch(API_BASE + "/api/tasks/" + tarjetaObj.id, {
          method: "DELETE"
        });
        const respuestaDatos = await respuestaDelete.json();

        if (respuestaDatos.success) {
          cardElem.remove(); // Eliminado físico asíncrono en front
        }
      } catch (errDelete) {
        console.error("Hubo un error al eliminar tarjeta:", errDelete);
      }
    }
  });

  // Habilitar la transmisión del ID de la tarjeta en el evento dragstart
  cardElem.addEventListener("dragstart", function (eventoArrastre) {
    if (eventoArrastre.dataTransfer) {
      eventoArrastre.dataTransfer.setData("text/plain", cardElem.id);
      eventoArrastre.dataTransfer.effectAllowed = "move";
    }
    cardElem.classList.add("tarjeta-arrastrada");
  });

  cardElem.addEventListener("dragend", function () {
    cardElem.classList.remove("tarjeta-arrastrada");
  });

  cardElem.appendChild(cardSpan);
  cardElem.appendChild(btnBorrarCard);

  return cardElem;
}

// -----------------------------------------------------------------
// 5. REGISTRAR BOTÓN DE NAVEGACIÓN GLOBAL ("NUEVA COLUMNA")
// -----------------------------------------------------------------
addListBtn.addEventListener("click", function () {
  const tituloLista = prompt("Ingresa el título para la nueva lista de tareas:");
  if (tituloLista && tituloLista.trim() !== "") {
    const nuevoIdCol = "col-lista-" + Date.now();
    
    // Creación visual local
    crearColumnaVisual(nuevoIdCol, tituloLista.trim(), []);
    
    // Guardar estado consolidado completo en el Node.js (PUT sync-board)
    sincronizarTableroBackend();
  }
});

/**
 * Mapea y lee todos los elementos visuales del DOM actualmente presentes en pantalla,
 * y los envía serializados por HTTP PUT para persistirlos en el Modelo del servidor express.
 */
async function sincronizarTableroBackend() {
  const columnasDOM = document.querySelectorAll(".columna-trello");

  const datosSincronizados = Array.from(columnasDOM).map(function (colDOM) {
    const colId = colDOM.getAttribute("data-id") || "";
    const colTituloStr = colDOM.querySelector(".col-titulo")?.textContent || "";
    const tarjetasDOM = colDOM.querySelectorAll(".tarjeta-trello");

    const tarjetasMapped = Array.from(tarjetasDOM).map(function (tarDOM) {
      return {
        id: tarDOM.id,
        contenido: tarDOM.querySelector(".tarjeta-texto")?.textContent || ""
      };
    });

    return {
      id: colId,
      titulo: colTituloStr,
      tarjetas: tarjetasMapped
    };
  });

  try {
    const respuestaSync = await fetch(API_BASE + "/api/tasks/sync", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosSincronizados)
    });
    console.log("Tablero sincronizado correctamente con el servidor Express.");
  } catch (error) {
    console.error("Fallo al guardar posición tras el movimiento:", error);
  }
}
