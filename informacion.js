export class Informacion extends Phaser.Scene {
    constructor() {
        super({ key: "Informacion" });
    }

    create() {
        document.getElementById('pdf-container').style.display = 'block';
        document.getElementById('pdf-iframe').src = '/informacion/TUTORIAL.pdf'; // Ruta del archivo PDF o PPT

        // Botón para volver al inicio
        let botonVolver = this.createStyledButton(this.scale.width / 2, this.scale.height - 750, 'Volver al Inicio');
        botonVolver.on('pointerdown', () => {
            // Ocultar el PDF cuando se vuelve al inicio
            document.getElementById('pdf-container').style.display = 'none';
            this.scene.start("Inicio"); // Regresar a la escena de inicio
        });
    }

    createStyledButton(x, y, text) {
        let boton = this.add.text(x, y, text, {
            font: '28px Arial',
            fill: '#000000',
            backgroundColor: '#ffcc00',
            padding: { x: 25, y: 10 },
            align: 'center',
            border: '2px solid #000000'
        }).setInteractive();
        boton.setOrigin(0.5, 0.5);

        boton.on('pointerover', () => {
            boton.setStyle({
                fill: '#000000',
                backgroundColor: '#ffff00'
            });
        });

        boton.on('pointerout', () => {
            boton.setStyle({
                fill: '#000000',
                backgroundColor: '#ffcc00'
            });
        });

        return boton;
    }
}
