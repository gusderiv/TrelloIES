/**
 * MODELO DE TAREAS Y TABLERO (TaskModel.js)
 * 
 * En el patrón de diseño MVC, este modelo se encarga de resguardar el estado
 * de las columnas de nuestro Trello y sus tarjetas de tareas individuales.
 * El estado vive temporalmente en la memoria RAM del servidor.
 */

// Estado inicial por defecto para que el tablero no se vea vacío al ingresar
let columnsState = [
  {
    id: "pendiente",
    titulo: "Pendiente 📌",
    tarjetas: [
      { id: "card-1", contenido: "Preparar presentación del proyecto para clase" },
      { id: "card-2", contenido: "Revisar los requisitos del patrón MVC en Express" }
    ]
  },
  {
    id: "proceso",
    titulo: "En Proceso ⚡",
    tarjetas: [
      { id: "card-3", contenido: "Desarrollar el frontend interactivo con JavaScript Vanilla" },
      { id: "card-4", contenido: "Configurar el servidor con Node.js y Express" }
    ]
  },
  {
    id: "completado",
    titulo: "Completado ✅",
    tarjetas: [
      { id: "card-5", contenido: "Crear lógica de Login predeterminado usando el atributo 'required'" }
    ]
  }
];

export class TaskModel {
  /**
   * Retorna todo el tablero de tareas actual (array de columnas).
   */
  static obtenerTablero() {
    return columnsState;
  }

  /**
   * Sobrescribe y actualiza el estado completo del tablero.
   * Útil cuando se mueven tarjetas entre columnas (Drag and Drop).
   */
  static guardarTablero(nuevoTablero) {
    columnsState = nuevoTablero;
  }

  /**
   * Registra una nueva tarjeta en una columna determinada.
   */
  static agregarTarjeta(columnaId, contenido) {
    const columna = columnsState.find(function(col) {
      return col.id === columnaId;
    });

    if (!columna) return null;

    const nuevaTarjeta = {
      id: "card-" + Date.now(), // ID dinámico usando la marca de tiempo
      contenido: contenido
    };

    columna.tarjetas.push(nuevaTarjeta);
    return nuevaTarjeta;
  }

  /**
   * Elimina una tarjeta del tablero en base a su ID.
   */
  static eliminarTarjeta(tarjetaId) {
    let eliminado = false;

    // Filtramos las tarjetas en todas las columnas para sacar la eliminada
    columnsState = columnsState.map(function(col) {
      const tarjetasFiltradas = col.tarjetas.filter(function(tarjeta) {
        if (tarjeta.id === tarjetaId) {
          eliminado = true;
          return false; // Se remueve del array
        }
        return true;
      });

      return {
        id: col.id,
        titulo: col.titulo,
        tarjetas: tarjetasFiltradas
      };
    });

    return eliminado;
  }
}
