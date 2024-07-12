export class ColeccionPosiciones extends Posicion {
    constructor() {
        this.posiciones = [];
    }

    agregarPosicion(posicion) {
        this.posiciones.push(posicion);
    }

    eliminarPosicion(posicion) {
        this.posiciones = this.posiciones.filter(pos => pos !== posicion);
    }

    obtenerPosicion(id) {
        return this.posiciones.find(pos => pos.id === id);
    }

    obtenerPosiciones() {
        return this.posiciones;
    }
}