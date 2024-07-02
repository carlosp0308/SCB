class Conexion {
    constructor() {
        this.conexion = new XMLHttpRequest();
    }

    enviarPeticion(url, metodo, datos, callback) {
        this.conexion.open(metodo, url, true);
        this.conexion.setRequestHeader("Content-Type", "application/json");
        this.conexion.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback(this.responseText);
            }
        }
        this.conexion.send(datos);
    }
}