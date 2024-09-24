import { Contenedor } from './contenedor.js';
import { Cuadricula } from './cuadricula.js';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

const AREA_WIDTH = 5;
const AREA_HEIGHT = 10;
const SEPARATION = 65;
const SEPARATION2 = 20;

const AREAS = [
    { x: 50, y: 70, width: 250, height: 400 },
    ...Array.from({ length: 6 }, (_, row) => (
        Array.from({ length: 13 }, (_, col) => ({
            x: 275 + col * (AREA_WIDTH + SEPARATION),
            y: 530 + row * (AREA_HEIGHT + SEPARATION2),
            width: AREA_WIDTH,
            height: AREA_HEIGHT
        }))
    )).flat()
];
const positions = [
    { x: 50, y: 70 }, { x: 120, y: 70 }, { x: 190, y: 70 }, { x: 260, y: 70 },
    { x: 50, y: 100 }, { x: 120, y: 100 }, { x: 190, y: 100 }, { x: 260, y: 100 },
    { x: 50, y: 130 }, { x: 120, y: 130 }, { x: 190, y: 130 }, { x: 260, y: 130 },
    { x: 50, y: 160 }, { x: 120, y: 160 }, { x: 190, y: 160 }, { x: 260, y: 160 },
    { x: 50, y: 190 }, { x: 120, y: 190 }, { x: 190, y: 190 }, { x: 260, y: 190 },
    { x: 50, y: 210 }, { x: 120, y: 210 }, { x: 190, y: 210 }, { x: 260, y: 210 },
    { x: 50, y: 240 }, { x: 120, y: 240 }, { x: 190, y: 240 }, { x: 260, y: 240 },
    { x: 50, y: 270 }, { x: 120, y: 270 }, { x: 190, y: 270 }, { x: 260, y: 270 },
    { x: 50, y: 300 }, { x: 120, y: 300 }, { x: 190, y: 300 }, { x: 260, y: 300 },
    { x: 50, y: 340 }, { x: 120, y: 340 }, { x: 190, y: 340 }, { x: 260, y: 340 },
    { x: 50, y: 370 }, { x: 120, y: 370 }, { x: 190, y: 370 }, { x: 260, y: 370 },
    { x: 50, y: 400 }, { x: 120, y: 400 }, { x: 190, y: 400 }, { x: 260, y: 400 },
    { x: 50, y: 430 }, { x: 120, y: 430 }, { x: 190, y: 430 }, { x: 260, y: 430 },
    { x: 50, y: 460 }, { x: 120, y: 460 }, { x: 190, y: 460 }, { x: 260, y: 460 },
];

export class Simulador extends Phaser.Scene {
    constructor() {
        super({ key: "Simulador" });
        this.cuadricula = new Cuadricula(this, AREAS);
        this.containerId = 1; // ID incremental para los contenedores
        this.positionIndex = 0; // Índice para las posiciones de los contenedores
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

        // Registrar eventos de arrastre.
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
        // Actualiza los contadores después del arrastre
        this.updateAreaCounters();
    }

    // Nuevo método para actualizar los contadores de cada área
    updateAreaCounters() {
        this.cuadricula.updateContadores();
    }


    createContainers(data) {
        data.forEach(item => {
            // Obtener la posición actual para el grupo de contenedores
            const pos = positions[this.positionIndex];

            // Para cada contenedor en el grupo (misma posición)
            for (let i = 0; i < item.cantidad; i++) {
                // Crear el contenedor en la posición actual (mismos x e y)
                const contenedor = new Contenedor(this, pos.x, pos.y, item.tipo, 0.0125, item.peso, this.containerId++);
                this.cuadricula.addContenedor(contenedor);
            }

            // Incrementar el índice de la posición, volviendo al inicio si supera el límite
            this.positionIndex = (this.positionIndex + 1) % positions.length;
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
            
                fetch('http://localhost:8080/api/reubicacion', {
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