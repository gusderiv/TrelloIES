/**
 * SCRIPT ACADÉMICO DE PRUEBAS DE CAJA NEGRA (test-cajanegra.js)
 * 
 * Este script automatiza pruebas de caja negra (Black-Box Testing)
 * sobre la API de nuestro servidor Express en el puerto 3000.
 * 
 * ¿Por qué es Caja Negra?
 * Porque no conocemos ni modificamos los archivos internos ni las variables en memoria del código.
 * Enviamos entradas HTTP (fetch) y verificamos que el servidor devuelva los códigos de estado
 * y respuestas JSON acordes a la especificación esperada.
 * 
 * REQUISITO: El servidor de Node debe estar encendido (npm run dev o node server.js)
 * en el puerto 3000 antes de ejecutar este script en otra terminal con:
 *   node test-cajanegra.js
 */

const API_URL = "http://localhost:3000/api";

// Helper para imprimir con colores de consola sencillos
const log = {
  success: (msg) => console.log(`\x1b[32m✔ [ÉXITO] ${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m✘ [FALLO] ${msg}\x1b[0m`),
  header: (msg) => console.log(`\x1b[36m\n=== ${msg} ===\x1b[0m`)
};

async function ejecutarPruebasCajaNegra() {
  log.header("INICIANDO PRUEBAS DE CAJA NEGRA (BLACK-BOX TESTING)");
  console.log("Objetivo: Probar endpoints como entradas/salidas herméticas (caja negra).");
  console.log(`Conectando con el servidor en: ${API_URL}`);

  let pruebasPasadas = 0;
  let pruebasTotales = 0;

  function evaluar(nombre, condicion, extraInfo = "") {
    pruebasTotales++;
    if (condicion) {
      pruebasPasadas++;
      log.success(nombre);
    } else {
      log.error(`${nombre} ${extraInfo}`);
    }
  }

  try {
    // -------------------------------------------------------------
    // PRUEBA 1: Login con Credenciales Correctas (Caso Éxito)
    // -------------------------------------------------------------
    try {
      const resLoginOk = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "123" })
      });

      const dataLoginOk = await resLoginOk.json();
      evaluar(
        "Prueba 1 (Login Exitoso): Responder con success: true ante credenciales válidas",
        resLoginOk.status === 200 && dataLoginOk.success === true,
        `(Status: ${resLoginOk.status}, success: ${dataLoginOk.success})`
      );
    } catch (e) {
      evaluar("Prueba 1 (Login Exitoso): Fallo al realizar la petición", false, `(${e.message})`);
    }

    // -------------------------------------------------------------
    // PRUEBA 2: Login con Credenciales Incorrectas (Caso Fallo)
    // -------------------------------------------------------------
    try {
      const resLoginFail = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "usuarioClase", password: "mal" })
      });

      const dataLoginFail = await resLoginFail.json();
      evaluar(
        "Prueba 2 (Login Erróneo): Bloquear accesos inválidos y retornar success: false",
        resLoginFail.status >= 400 || dataLoginFail.success === false,
        `(Status: ${resLoginFail.status}, success: ${dataLoginFail.success})`
      );
    } catch (e) {
      evaluar("Prueba 2 (Login Erróneo): Fallo al realizar la petición", false, `(${e.message})`);
    }

    // -------------------------------------------------------------
    // PRUEBA 3: Lectura del Tablero Kanban (GET Tasks)
    // -------------------------------------------------------------
    try {
      const resGetTasks = await fetch(`${API_URL}/tasks`);
      const dataTasks = await resGetTasks.json();
      evaluar(
        "Prueba 3 (Lectura Kanban): Retornar arreglo de columnas desde el backend",
        resGetTasks.status === 200 && Array.isArray(dataTasks),
        `(Status: ${resGetTasks.status}, Tipo devuelto: ${typeof dataTasks})`
      );
    } catch (e) {
      evaluar("Prueba 3 (Lectura Kanban): Fallo al realizar la petición", false, `(${e.message})`);
    }

    // -------------------------------------------------------------
    // PRUEBA 4: Creación de Tareas (POST Tasks)
    // -------------------------------------------------------------
    let tareaCreadaId = null;
    try {
      const resPostTask = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          columnaId: "pendiente",
          contenido: "Prueba de Caja Negra Automatizada"
        })
      });

      const dataPostTask = await resPostTask.json();
      if (dataPostTask.success && dataPostTask.tarjeta) {
        tareaCreadaId = dataPostTask.tarjeta.id;
      }

      evaluar(
        "Prueba 4 (Registro de Tareas): Retornar success: true y objeto con ID autogenerado",
        (resPostTask.status === 200 || resPostTask.status === 201) && dataPostTask.success === true && !!tareaCreadaId,
        `(Status: ${resPostTask.status}, Tarea ID: ${tareaCreadaId})`
      );
    } catch (e) {
      evaluar("Prueba 4 (Registro de Tareas): Fallo al realizar la petición", false, `(${e.message})`);
    }

    // -------------------------------------------------------------
    // PRUEBA 5: Borrado de Tareas (DELETE Tasks)
    // -------------------------------------------------------------
    if (tareaCreadaId) {
      try {
        const resDeleteTask = await fetch(`${API_URL}/tasks/${tareaCreadaId}`, {
          method: "DELETE"
        });
        const dataDelete = await resDeleteTask.json();

        evaluar(
          "Prueba 5 (Eliminación Segura): Confirmar borrado exitoso en el backend por ID",
          resDeleteTask.status === 200 && dataDelete.success === true,
          `(Status: ${resDeleteTask.status}, Response: ${JSON.stringify(dataDelete)})`
        );
      } catch (e) {
        evaluar("Prueba 5 (Eliminación Segura): Fallo al borrar la tarjeta", false, `(${e.message})`);
      }
    } else {
      console.log("\x1b[33m⚠ Omitiendo Prueba 5: No se pudo generar una ID válida en la Prueba 4.\x1b[0m");
    }

    // -------------------------------------------------------------
    // RESUMEN FINAL
    // -------------------------------------------------------------
    log.header("RESUMEN DE PRUEBAS DE CAJA NEGRA");
    console.log(`Pruebas ejecutadas: ${pruebasTotales}`);
    console.log(`Pruebas exitosas  : \x1b[32m${pruebasPasadas}\x1b[0m`);
    console.log(`Pruebas fallidas  : \x1b[31m${pruebasTotales - pruebasPasadas}\x1b[0m`);

    if (pruebasPasadas === pruebasTotales) {
      console.log("\x1b[32;1m¡EXCELENTE! Tu backend responde al 100% de los criterios de Caja Negra.\x1b[0m\n");
    } else {
      console.log("\x1b[33m¡Atención! Algunas pruebas han fallado. Verifica la conexión o los endpoints del Servidor.\x1b[0m\n");
    }

  } catch (errorGeneral) {
    console.error("\x1b[31mError fatal al intercomunicar con el servidor local en puerto 3000:\x1b[0m", errorGeneral.message);
    console.log("\x1b[33mAsegúrate de que estás corriendo 'npm run dev' en tu terminal secundaria.\x1b[0m\n");
  }
}

// Iniciar pruebas
ejecutarPruebasCajaNegra();
