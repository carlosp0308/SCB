import {Simulador} from "./simulador.js";
import { IngresarDatos } from './IngresarDatos';
import { Inicio } from "./inicio.js";

const config = {
    type: Phaser.AUTO,
    width: 1350,
    height: 780,
    backgroundColor: "#3c4c8f",
    scene: [Inicio, IngresarDatos, Simulador]
}

const game = new Phaser.Game(config);