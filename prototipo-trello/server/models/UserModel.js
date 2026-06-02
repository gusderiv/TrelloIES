/**
 * MODELO DE USUARIOS (UserModel.js)
 * 
 * En el patrón MVC, el Modelo representa los Datos y los métodos para manipularlos.
 * En nuestro caso, usamos un array de JavaScript en memoria para simular
 * una base de datos de usuarios registrados de forma sencilla.
 */

// Array global que actúa como nuestra base de datos local de clase
export const usuariosRegistrados = [
  {
    username: "admin",
    passwordHash: "123" // Credenciales predeterminadas sugeridas
  }
];

export class UserModel {
  /**
   * Busca e indica si existe un usuario registrado que coincida con el usuario y la contraseña.
   * @param {string} username 
   * @param {string} password 
   * @returns {boolean}
   */
  static buscarYValidar(username, password) {
    // Buscamos si hay correspondencia de credenciales en el array
    const usuarioEncontrado = usuariosRegistrados.find(function(user) {
      return user.username.toLowerCase() === username.toLowerCase() && user.passwordHash === password;
    });

    // Retorna true si encontró el usuario, de lo contrario false
    return usuarioEncontrado !== undefined;
  }
}
