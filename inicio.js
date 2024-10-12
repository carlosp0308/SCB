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
        titulo.setOrigin(0.5, 0); // Centra el texto horizontalmente en el punto dado

        // Subtítulo
        let subtitulo = this.add.text(this.scale.width / 2, titulo.y + 80, '(Simulador de Carga en Buques)', {
            font: '28px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2 },
            align: 'center'
        });
        subtitulo.setOrigin(0.5, 0); // Centra el texto horizontalmente en el punto dado

        // Botón de inicio
        let botonInicio = this.add.text(this.scale.width / 2, this.scale.height - 150, 'Iniciar Simulador', {
            font: '24px Arial',
            fill: '#ffffff',
            backgroundColor: '#ffcc00', // Color de fondo del botón
            padding: { x: 30, y: 15 }, // Espaciado dentro del botón
            border: '2px solid #000000', // Borde del botón
            align: 'center'
        }).setInteractive();

        botonInicio.setOrigin(0.5, 0.5); // Centra el texto horizontal y verticalmente

        // Añadir efecto de hover
        botonInicio.on('pointerover', () => {
            botonInicio.setStyle({
                fill: '#000000',
                backgroundColor: '#ffff00' // Cambia el color de fondo cuando el ratón está sobre el botón
            });
        });

        botonInicio.on('pointerout', () => {
            botonInicio.setStyle({
                fill: '#ffffff',
                backgroundColor: '#ffcc00' // Restaura el color de fondo original
            });
        });

        // Acción al hacer clic en el botón
        botonInicio.on('pointerdown', () => {
            this.scene.start("IngresarDatos");
        });

        // Botón de información
        let botonInfo = this.add.text(this.scale.width / 2, this.scale.height - 50, 'Información', {
    font: '24px Arial',
    fill: '#ffffff',
    backgroundColor: '#ffcc00', // Color de fondo del botón
    padding: { x: 30, y: 15 }, // Espaciado dentro del botón
    border: '2px solid #000000', // Borde del botón
    align: 'center'

       }).setInteractive();

          botonInfo.setOrigin(0.5, 0.5);


        // Añadir efecto de hover
        botonInfo.on('pointerover', () => {
            botonInfo.setStyle({
                fill: '#000000',
                backgroundColor: '#ffff00' // Cambia el color de fondo cuando el ratón está sobre el botón
            });
        });

    
            botonInfo.on('pointerout', () => {
                botonInfo.setStyle({
                    fill: '#ffffff',
                    backgroundColor: '#ffcc00' // Restaura el color de fondo original
                });
            });
    





        // Acción al hacer clic en el botón de información
         botonInfo.on('pointerdown', () => {
         this.scene.start("Informacion"); // Lleva a la escena de información
         });

       }
}
