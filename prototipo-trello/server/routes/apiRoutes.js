import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { TaskController } from "../controllers/TaskController.js";

/**
 * RUTAS DEL BACKEND (apiRoutes.js)
 * 
 * En el patrón MVC, el enrutado asocia cada dirección URL HTTP 
 * con la función indicada del Controlador correspondiente.
 */
const router = Router();

// Endpoint de Autenticación (POST)
router.post("/auth/login", AuthController.login);

// Endpoints del Tablero (CRUD)
router.get("/tasks", TaskController.obtenerTablero);    // Obtener todo el tablero
router.post("/tasks", TaskController.crearTarjeta);      // Agregar tarjeta
router.put("/tasks/sync", TaskController.guardarTablero); // Sincronizar tras Drag & Drop o cambio de orden
router.delete("/tasks/:id", TaskController.eliminarTarjeta); // Eliminar tarjeta específica

export default router;
