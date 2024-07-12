export class ColeccionContenedores extends Contenedor {
    constructor() {
        this.contenedores = [];
    }

    agregarContenedor(contenedor) {
        this.contenedores.push(contenedor);
    }

    eliminarContenedor(contenedor) {
        this.contenedores = this.contenedores.filter(cont => cont !== contenedor);
    }

    obtenerContenedor(id) {
        return this.contenedores.find(cont => cont.id === id);
    }

    obtenerContenedores() {
        return this.contenedores;
    }
}