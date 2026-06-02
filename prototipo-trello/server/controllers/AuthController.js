import { UserModel } from "../models/UserModel.js";

/**
 * CONTROLADOR DE AUTENTICACIÓN (AuthController.js)
 * 
 * En el patrón MVC, el Controlador actúa como intermediario:
 * Recibe los datos de la Vista (solicitud HTTP POST del cliente), 
 * los valida o pasa al Modelo para procesar, y finalmente retorna la respuesta correspondiente.
 */
export class AuthController {
  /**
   * Procesa la solicitud POST para comprobar credenciales de usuario.
   */
  static login(req, res) {
    const { username, password } = req.body;

    // Validación elemental de campos obligatorios en el Controller
    if (!username || !password) {
      res.status(400).json({
        success: false,
        error: "Falta rellenar el login completo. El nombre de usuario y la contraseña son requeridos."
      });
      return;
    }

    // Le pedimos al Modelo (UserModel) que verifique si el usuario es válido
    const esValido = UserModel.buscarYValidar(username, password);

    if (esValido) {
      // Retornar éxito a la vista en formato JSON
      res.status(200).json({
        success: true,
        message: "¡Autenticación con éxito!",
        user: { username }
      });
    } else {
      // Credenciales inválidas
      res.status(401).json({
        success: false,
        error: "Usuario o contraseña incorrectos."
      });
    }
  }
}
