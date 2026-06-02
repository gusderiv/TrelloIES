import { TaskModel } from "../models/TaskModel.js";

/**
 * CONTROLADOR DE TAREAS (TaskController.js)
 * 
 * En el patrón MVC, este controlador coordina las acciones del tablero.
 * Recibe solicitudes HTTP de lectura (GET), inserción (POST), actualización (PUT)
 * y borrado (DELETE), delegándoselas al TaskModel.
 */
export class TaskController {
  /**
   * Obtiene la estructura completa del tablero (columnas y tarjetas).
   */
  static obtenerTablero(req, res) {
    const tablero = TaskModel.obtenerTablero();
    res.status(200).json(tablero);
  }

  /**
   * Añade una nueva tarjeta a una columna específica.
   */
  static crearTarjeta(req, res) {
    const { columnaId, contenido } = req.body;

    if (!columnaId || !contenido) {
      res.status(400).json({ error: "No se proporcionaron todos los datos requeridos." });
      return;
    }

    const nuevaTarjeta = TaskModel.agregarTarjeta(columnaId, contenido);

    if (nuevaTarjeta) {
      res.status(201).json({
        success: true,
        message: "Tarjeta añadida correctamente",
        tarjeta: nuevaTarjeta
      });
    } else {
      res.status(404).json({ error: "La columna destino no fue encontrada." });
    }
  }

  /**
   * Guarda/Sincroniza todo el tablero (generalmente tras una acción Drag and Drop).
   */
  static guardarTablero(req, res) {
    const nuevoTablero = req.body;

    if (!Array.isArray(nuevoTablero)) {
      res.status(400).json({ error: "La estructura de datos de tablero recibida es inválida." });
      return;
    }

    TaskModel.guardarTablero(nuevoTablero);
    res.status(200).json({
      success: true,
      message: "Tablero sincronizado y guardado con éxito en el servidor Node.js"
    });
  }

  /**
   * Remueve una tarjeta del sistema dado su identificador id.
   */
  static eliminarTarjeta(req, res) {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Falta el id de la tarjeta de tarea para borrar." });
      return;
    }

    const eliminado = TaskModel.eliminarTarjeta(id);

    if (eliminado) {
      res.status(200).json({
        success: true,
        message: `Tarjeta de ID ${id} borrada del sistema de clase.`
      });
    } else {
      res.status(404).json({ error: `La tarjeta de ID ${id} no existe en memoria.` });
    }
  }
}
