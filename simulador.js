const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class Simulador extends Phaser.Scene {

    constructor() {
        super({ key: "Simulador" });
    }

    preload() {
        this.load.image("contenedor-blanco", "images/contenedor-blanco.png");
        this.load.image("buque", "images/buque.png");

        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        this.add.image(675, 500, "buque");

        var scene = this;

        var dropDownList = this.rexUI.add.dropDownList({
            x: 300, y: 50,

            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY),
            icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, COLOR_LIGHT),
            text: scene.add.text(0, 0, 'Seleccionar Contenedor', { fontSize: 20 }),

            space: { left: 10, right: 10, top: 10, bottom: 10, icon: 10 },

            options: [{ text: 'Contenedor', value: 0 }],

            list: {
                createBackgroundCallback: function (scene) {
                    return scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_DARK);
                },
                createButtonCallback: function (scene, option, index, options) {
                    var button = scene.rexUI.add.label({
                        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0),
                        text: scene.add.text(0, 0, option.text, { fontSize: 20 }),
                        space: { left: 10, right: 10, top: 10, bottom: 10, icon: 10 }
                    });
                    button.value = option.value;
                    return button;
                },

                onButtonClick: function (button, index, pointer, event) {
                    var imagenContenedor = scene.add.image(500, 250, "contenedor-blanco");
                    imagenContenedor.setScale(0.01);
                    imagenContenedor.setInteractive();
                    scene.input.setDraggable(imagenContenedor);

                    scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                        gameObject.x = dragX;
                        gameObject.y = dragY;
                    });
                },

                onButtonOver: function (button, index, pointer, event) {
                    button.getElement('background').setStrokeStyle(1, 0xffffff);
                },

                onButtonOut: function (button, index, pointer, event) {
                    button.getElement('background').setStrokeStyle();
                },
            },

            setValueCallback: function (dropDownList, value, previousValue) {
                console.log(value);
            },
            value: undefined

        }).layout();
    }
}


