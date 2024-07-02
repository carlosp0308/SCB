export class Cuadricula {
    constructor(filas, columnas) {
        this.filas = filas;
        this.columnas = columnas;
        this.cuadricula = new Array(filas);

        for (let i = 0; i < filas; i++) {
            this.cuadricula[i] = new Array(columnas).fill(null);
        }
    }

    agregarObjeto(fila, columna, objeto) {
        if (this.estaDentroDeLimites(fila, columna)) {
            this.cuadricula[fila][columna] = objeto;
        } else {
            console.error('Coordenadas fuera de los límites de la cuadrícula');
        }
    }

    obtenerObjeto(fila, columna) {
        if (this.estaDentroDeLimites(fila, columna)) {
            return this.cuadricula[fila][columna];
        } else {
            console.error('Coordenadas fuera de los límites de la cuadrícula');
            return null;
        }
    }

    estaDentroDeLimites(fila, columna) {
        return fila >= 0 && fila < this.filas && columna >= 0 && columna < this.columnas;
    }
}
