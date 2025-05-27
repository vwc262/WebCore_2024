/**
 * @returns {Nota}
 */
class Nota {
  /**
   *
   * @param {int} idEstacion
   * @param {string} NotaUsuario //11
   * @param {boolean}  response
   */
  constructor(idEstacion, NotaUsuario, response) {
    this.IdEstacion = idEstacion;
    this.NotaUsuario = NotaUsuario;
    this.response = response;
  }
}

export { Nota };
