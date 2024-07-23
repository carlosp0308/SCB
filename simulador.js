import { Contenedor } from './Contenedor.js';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
const CELL_SIZE = 40; // Tamaño de cada celda
const CONTAINER_AREA_X = 50; // X de la esquina superior izquierda del área de contenedores
const CONTAINER_AREA_Y = 70; // Y de la esquina superior izquierda del área de contenedores
const CONTAINER_AREA_WIDTH = 200; // Ancho del área de contenedores
const CONTAINER_AREA_HEIGHT = 400; // Alto del área de contenedores

export class Simulador extends Phaser.Scene {
    constructor() {
        super({ key: "Simulador" });
        this.contenedores = []; // Array para guardar referencias a los contenedores
        this.containerId = 1; // ID incremental para los contenedores
    }

    preload() {
        this.load.image("contenedor-blanco", "images/contenedor-blanco.png");
        this.load.image("contenedor-azul", "images/contenedor-azul.png");
        this.load.image("buque", "images/buque.png");
        this.load.image("guardar", "images/guardar.png");
        this.load.image("cargar", "images/cargar.png");
        this.load.image("volver", "images/volver.png");

        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create(data) {
        this.add.image(675, 615, "buque");

        // Dibujar el área de contenedores (opcional, solo para visualización)
       // const graphics = this.add.graphics();
       // graphics.lineStyle(2, 0xff0000);
       // graphics.strokeRect(CONTAINER_AREA_X, CONTAINER_AREA_Y, CONTAINER_AREA_WIDTH, CONTAINER_AREA_HEIGHT);

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
                    var contenedor = new Contenedor(scene, 500, 250, "contenedor-blanco", 0.0125, 'value', scene.containerId++);
                    scene.contenedores.push(contenedor);

                    scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                        gameObject.x = dragX;
                        gameObject.y = dragY;
                    });

                    scene.input.on('dragend', function (pointer, gameObject) {
                        // No hacemos nada especial aquí por ahora
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

        // Crear contenedores basados en los datos recibidos
        if (data) {
            this.createContainers(data.data);
        }

        // Botón para guardar la posición de los contenedores
        var saveButton = this.add.image(50, this.cameras.main.height - 30, 'guardar').setInteractive();
        saveButton.setScale(0.25);
        saveButton.on('pointerdown', () => {
            this.promptForSaveName();
        });

        // Botón para cargar la posición de los contenedores
        var loadButton = this.add.image(150, this.cameras.main.height - 30, 'cargar').setInteractive();
        loadButton.setScale(0.05);
        loadButton.on('pointerdown', () => {
            this.showLoadOptions();
        });

        // Botón para volver a la escena IngresarDatos
        var backButton = this.add.image(250, this.cameras.main.height - 30, 'volver').setInteractive();
        backButton.setScale(0.125);
        backButton.on('pointerdown', () => {
            this.scene.start('IngresarDatos');
        });
    }

    createContainers(data) {
        let x = CONTAINER_AREA_X + CELL_SIZE / 2;
        let y = CONTAINER_AREA_Y + CELL_SIZE / 2;
        let positions = [];
        let isAreaFull = false;

        // Generar posiciones iniciales
        while (x < CONTAINER_AREA_X + CONTAINER_AREA_WIDTH) {
            while (y < CONTAINER_AREA_Y + CONTAINER_AREA_HEIGHT) {
                positions.push({ x, y });
                y += CELL_SIZE;
            }
            y = CONTAINER_AREA_Y + CELL_SIZE / 2;
            x += CELL_SIZE;
        }

        let positionIndex = 0;

        data.forEach(item => {
            for (let i = 0; i < item.cantidad; i++) {
                if (positionIndex < positions.length) {
                    const pos = positions[positionIndex];
                    const contenedor = new Contenedor(this, pos.x, pos.y, item.tipo, 0.0125, item.peso, this.containerId++);
                    this.contenedores.push(contenedor);
                    positionIndex++;
                } else {
                    isAreaFull = true;
                    positionIndex = 0;
                    const pos = positions[positionIndex];
                    const contenedor = new Contenedor(this, pos.x, pos.y, item.tipo, 0.0125, item.peso, this.containerId++);
                    this.contenedores.push(contenedor);
                    positionIndex++;
                }
            }
        });
    }
    // Función para cargar datos
    loadContainerPositions(nombre) {
        // Eliminar contenedores existentes y sus etiquetas
        this.contenedores.forEach(contenedor => contenedor.destroy());
        this.contenedores = [];

        fetch('http://localhost:3000/api/cargar')
        .then(response => response.json())
        .then(data => {
            const savedData = data.find(item => item.nombre === nombre);
            if (savedData) {
                savedData.data.forEach(containerData => {
                    const contenedor = new Contenedor(this, containerData.x, containerData.y, containerData.tipo, 0.0125, containerData.peso, containerData.id);
                    this.contenedores.push(contenedor);
                });
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Función para guardar datos
    saveContainerPositions(nombre) {
        const data = this.contenedores.map(cont => ({
            x: cont.getPosition().x,
            y: cont.getPosition().y,
            id: cont.getId(), // Guardar el ID del contenedor
            peso: cont.getPeso(), // Guardar el peso del contenedor
            tipo: cont.getTexture() // Guardar el tipo del contenedor
        }));

        fetch('http://localhost:3000/api/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, data }) // Enviando el nombre y los datos
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Función para pedir nombre para el guardado
    promptForSaveName() {
        const nombre = prompt('Ingrese el nombre para guardar:');
        if (nombre) {
            this.saveContainerPositions(nombre);
        }
    }

    // Función para mostrar las opciones de carga
    showLoadOptions() {
        fetch('http://localhost:3000/api/guardados')
        .then(response => response.json())
        .then(names => {
            const selectedName = prompt('Seleccione un guardado:\n' + names.join('\n'));
            if (selectedName) {
                this.loadContainerPositions(selectedName);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
