export class Inicio extends Phaser.Scene {
    constructor() {
        super({ key: "Inicio" });
    }

    preload() {
        this.load.image("botonInicio", "/images/botonInicio.png");
        this.load.image("fondoInicio", "/images/fondo-inicio.png");
    }
    
    create() {

        let fondoInicio = this.add.image(0, 0, "fondoInicio");
        fondoInicio.setOrigin(0, 0);
        fondoInicio.setDisplaySize(this.scale.width, this.scale.height);
        let botonInicio = this.add.image(300, 350, "botonInicio").setInteractive();
    
        botonInicio.on("pointerdown", () => {
            this.scene.start("IngresarDatos");
        });
    }
}

