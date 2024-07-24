import { Contenedor } from './contenedor.js';
import { Cuadricula } from './Cuadricula.js';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

const AREA_WIDTH = 15;
const AREA_HEIGHT = 20;
const SEPARATION = 110;
const SEPARATION2 = 34;

const AREAS = [
    { x: 50, y: 70, width: 200, height: 400 },
    ...Array.from({ length: 4 }, (_, row) => (
        Array.from({ length: 7 }, (_, col) => ({
            x: 295 + col * (AREA_WIDTH + SEPARATION),
            y: 525 + row * (AREA_HEIGHT + SEPARATION2),
            width: AREA_WIDTH,
            height: AREA_HEIGHT
        }))
    )).flat()
];

export class Simulador extends Phaser.Scene {
    constructor() {
        super({ key: "Simulador" });
        this.cuadricula = new Cuadricula(this, AREAS);
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
        this.add.image(675, 620, "buque");
        this.cuadricula.drawAreas();

        this.createButtons();

        // Crear contenedores basados en los datos recibidos
        if (data) {
            this.createContainers(data.data);
        }

        // Registrar eventos de arrastre
        this.input.on('drag', this.handleDrag, this);
        this.input.on('dragend', this.handleDragEnd, this);
    }

    createButtons() {
        this.createButton(50, this.cameras.main.height - 30, 'guardar', 0.25, this.promptForSaveName);
        this.createButton(150, this.cameras.main.height - 30, 'cargar', 0.05, this.showLoadOptions);
        this.createButton(250, this.cameras.main.height - 30, 'volver', 0.125, () => this.scene.start('IngresarDatos'));
        this.createTextButton(950, this.cameras.main.height - 30, 'Info Areas', this.showInfoAreas.bind(this));
        this.createTextButton(1100, this.cameras.main.height - 30, 'Reubicar Contenedores', this.reubicarContenedores.bind(this));
    }

    createButton(x, y, texture, scale, onClick) {
        let button = this.add.image(x, y, texture).setInteractive().setScale(scale);
        button.on('pointerdown', onClick, this);
    }

    createTextButton(x, y, text, onClick) {
        let button = this.add.text(x, y, text, { fontSize: '20px', fill: '#ffffff' }).setInteractive();
        button.on('pointerdown', onClick);
    }

    handleDrag(pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
        if (gameObject.label) {
            gameObject.label.setPosition(dragX, dragY);
        }
    }

    handleDragEnd(pointer, gameObject) {
        if (!this.cuadricula.isInAnyArea(gameObject.x, gameObject.y)) {
            let snappedPosition = this.cuadricula.snapToClosestArea(gameObject);
            gameObject.setPosition(snappedPosition.x, snappedPosition.y);
            if (gameObject.label) {
                gameObject.label.setPosition(snappedPosition.x, snappedPosition.y);
            } else {
                // Actualizar la posición del texto del contenedor
                let contenedor = this.cuadricula.getContenedorBySprite(gameObject);
                if (contenedor) {
                    contenedor.updateTextPosition(snappedPosition.x, snappedPosition.y);
                }
            }
        }
    }

    createContainers(data) {
        let x = AREAS[0].x + this.cuadricula.cellSize / 2;
        let y = AREAS[0].y + this.cuadricula.cellSize / 2;
        let positions = [];
        let isAreaFull = false;

        // Generar posiciones iniciales en la primera área
        while (x < AREAS[0].x + AREAS[0].width) {
            while (y < AREAS[0].y + AREAS[0].height) {
                positions.push({ x, y });
                y += this.cuadricula.cellSize;
            }
            y = AREAS[0].y + this.cuadricula.cellSize / 2;
            x += this.cuadricula.cellSize;
        }

        let positionIndex = 0;

        data.forEach(item => {
            for (let i = 0; i < item.cantidad; i++) {
                if (positionIndex < positions.length) {
                    const pos = positions[positionIndex];
                    const contenedor = new Contenedor(this, pos.x, pos.y, item.tipo, 0.0125, item.peso, this.containerId++);
                    this.cuadricula.addContenedor(contenedor);
                    positionIndex++;
                } else {
                    isAreaFull = true;
                    positionIndex = 0;
                    const pos = positions[positionIndex];
                    const contenedor = new Contenedor(this, pos.x, pos.y, item.tipo, 0.0125, item.peso, this.containerId++);
                    this.cuadricula.addContenedor(contenedor);
                    positionIndex++;
                }
            }
        });
    }

          loadContainerPositions(nombre) {
         this.cuadricula.getContenedores().forEach(contenedor => contenedor.destroy());
         this.cuadricula.contenedores = [];

              fetch('http://localhost:3000/api/cargar')
            .then(response => response.json())
            .then(data => {
                const savedData = data.find(item => item.nombre === nombre);
                if (savedData) {
                    savedData.data.forEach(containerData => {
                        const contenedor = new Contenedor(this, containerData.x, containerData.y, containerData.tipo, 0.0125, containerData.peso, containerData.id);
                        this.cuadricula.addContenedor(contenedor);
                    });
                }
            })
            .catch(error => console.error('Error:', error));
           }

            saveContainerPositions(nombre) {
            const data = this.cuadricula.getContenedores().map(cont => ({
            x: cont.getPosition().x,
            y: cont.getPosition().y,
            id: cont.getId(),
            peso: cont.getPeso(),
            tipo: cont.getTexture()
        }));

        fetch('http://localhost:3000/api/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, data })
          })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
            }

             promptForSaveName() {
             const nombre = prompt('Ingrese el nombre para guardar:');
              if (nombre) {
             this.saveContainerPositions(nombre);
             }
             }

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

            showInfoAreas() {
            const areasInfo = this.cuadricula.areas.map(area => {
            const contenedores = this.cuadricula.getContenedoresByAreaId(area.id);
            const contenedoresInfo = contenedores.map(contenedor => ({
                id: contenedor.getId(),
                peso: contenedor.getPeso(),
                tipo: contenedor.getTexture()
            }));
            return {
                areaId: area.id,
                contenedores: contenedoresInfo
            };
             });
    
             console.log(JSON.stringify(areasInfo, null, 2));
           }
            // Método para reubicar los contenedores
            reubicarContenedores() {
                const areasInfo = this.cuadricula.areas.map(area => {
                    const contenedores = this.cuadricula.getContenedoresByAreaId(area.id);
                    const contenedoresInfo = contenedores.map(contenedor => ({
                        id: contenedor.getId(),
                        peso: contenedor.getPeso(),
                        tipo: contenedor.getTexture()
                    }));
                    return {
                        id: area.id,
                        contenedores: contenedoresInfo
                    };
                });
            
                console.log('Datos enviados al backend:', JSON.stringify({ areas: areasInfo }, null, 2));
            
                fetch('http://localhost:3000/api/reubicacion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ areas: areasInfo })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Datos recibidos del backend:', JSON.stringify(data, null, 2));
                    if (Array.isArray(data)) {
                        data.forEach(newInfo => {
                            const contenedor = this.cuadricula.getContenedorById(newInfo.id);
                            if (contenedor) {
                                contenedor.setPosition(newInfo.x, newInfo.y);
                                contenedor.sprite.peso = newInfo.peso;
                                contenedor.sprite.setTexture(newInfo.tipo);
                                contenedor.text.setText(`${newInfo.peso}t`);
                            }
                        });
                    } else {
                        console.error('Formato de respuesta inesperado:', data);
                    }
                })
                .catch(error => console.error('Error:', error));
            }
            
            
            
    

}
