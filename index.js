import {Simulador} from "./simulador.js";
import { IngresarDatos } from "./IngresarDatos.js";
import { Inicio } from "./inicio.js";
import { Informacion } from "./informacion.js";

const config = {
    type: Phaser.AUTO,
    width: 1400,
    height: 780,
    backgroundColor: "#3c4c8f",
    scene: [Inicio, IngresarDatos, Informacion, Simulador]
}

const game = new Phaser.Game(config);
