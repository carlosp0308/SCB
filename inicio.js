

export class Inicio extends Phaser.Scene {
    constructor() {
        super({ key: "Inicio" });
    }

    preload() {
        this.load.image("botonInicio", "images/botonInicio.png");
    }

    create() {
       

        let botonInicio = this.add.image(300, 350, "botonInicio").setInteractive();
        botonInicio.on("pointerdown", () => {
            this.scene.start("IngresarDatos");
        });
    }
}
