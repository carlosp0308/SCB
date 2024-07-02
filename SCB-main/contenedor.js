class Contenedor {
    constructor(id, tipo, longitud, peso) {
        this.id = id;
        this.tipo = tipo;
        this.longitud = longitud;
        this.peso = peso;
    }

    get getId() {
        return this.id;
    }

    set setId(id) {
        this.id = id;
    }

    get getTipo() {
        return this.tipo;
    }

    set setTipo(tipo) {
        this.tipo = tipo;
    }

    get getLongitud() {
        return this.longitud;
    }

    set setLongitud(longitud) {
        this.longitud = longitud;
    }

    get getPeso() {
        return this.peso;
    }

    set setPeso(peso) {
        this.peso = peso;
    }


}