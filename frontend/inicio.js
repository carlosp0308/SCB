export class Inicio extends Phaser.Scene {
    constructor() {
        super({ key: "Inicio" });
    }

    preload() {
        this.load.image("fondoInicio", "/images/fondo-inicio.png");
    }
    
    create() {
        // Fondo
        let fondoInicio = this.add.image(0, 0, "fondoInicio");
        fondoInicio.setOrigin(0, 0);
        fondoInicio.setDisplaySize(this.scale.width, this.scale.height);

        // Título
        let titulo = this.add.text(this.scale.width / 2, 100, 'SCB', {
            font: '64px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 4 },
            align: 'center'
        });
        titulo.setOrigin(0.5, 0);

        // Subtítulo
        let subtitulo = this.add.text(this.scale.width / 2, titulo.y + 80, '(Simulador de Carga en Buques)', {
            font: '28px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2 },
            align: 'center'
        });
        subtitulo.setOrigin(0.5, 0);

        // Botón de inicio
        let botonInicio = this.add.text(this.scale.width / 2, this.scale.height - 100, 'Iniciar', {
            font: '36px Arial',
            fill: '#0a0a0a',
            backgroundColor: '#2699e6',
            padding: { x: 30, y: 15 },
            border: '2px solid #000000',
            align: 'center'
        }).setInteractive();

        botonInicio.setOrigin(0.5, 0.5); // Centra el texto horizontal y verticalmente

        // Hover del boton
        botonInicio.on('pointerover', () => {
            botonInicio.setStyle({
                fill: '#0a0a0a',
                backgroundColor: '#1a66cc'
            });
        });

        botonInicio.on('pointerout', () => {
            botonInicio.setStyle({
                fill: '#0a0a0a',
                backgroundColor: '#2699e6'
            });
        });

        // Direccion de pagina
        botonInicio.on('pointerdown', () => {
            this.scene.start("IngresarDatos");
        });
    }
}
