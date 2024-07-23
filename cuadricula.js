export class Cuadricula {
    constructor(scene, areas) {
        this.scene = scene;
        this.areas = areas.map((area, index) => ({ ...area, id: index + 1 })); // Asignar un ID único a cada área
        this.cellSize = 50; // Tamaño de cada celda
        this.contenedores = []; // Array para almacenar los contenedores
    }

    // Dibuja las áreas en la escena utilizando gráficos.
    drawAreas() {
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(0); // No visible border

        this.areas.forEach(area => {
            graphics.strokeRect(area.x, area.y, area.width, area.height);
        });
    }

    // Verifica si una coordenada (x, y) está dentro de cualquier área definida.
    isInAnyArea(x, y) {
        return this.areas.some(area => (
            x >= area.x && x < area.x + area.width &&
            y >= area.y && y < area.y + area.height
        ));
    }

    // Obtiene el área más cercana a una coordenada (x, y).
    getClosestArea(x, y) {
        let closestArea = null;
        let minDistance = Infinity;

        this.areas.forEach(area => {
            const centerX = area.x + area.width / 2;
            const centerY = area.y + area.height / 2;
            const distance = Phaser.Math.Distance.Between(x, y, centerX, centerY);

            if (distance < minDistance) {
                closestArea = area;
                minDistance = distance;
            }
        });

        return closestArea;
    }

    // Ajusta un objeto de juego a la posición más cercana dentro de un área.
    snapToClosestArea(gameObject) {
        const closestArea = this.getClosestArea(gameObject.x, gameObject.y);

        if (closestArea) {
            const snappedX = Phaser.Math.Clamp(gameObject.x, closestArea.x, closestArea.x + closestArea.width - this.cellSize);
            const snappedY = Phaser.Math.Clamp(gameObject.y, closestArea.y, closestArea.y + closestArea.height - this.cellSize);
            return { x: snappedX, y: snappedY };
        }

        return { x: gameObject.x, y: gameObject.y };
    }

    // Añade un contenedor a la cuadrícula.
    addContenedor(contenedor) {
        this.contenedores.push(contenedor);
    }

    // Obtiene todos los contenedores de la cuadrícula.
    getContenedores() {
        return this.contenedores;
    }

    // Obtiene la cantidad de contenedores en la cuadrícula.
    getCantidadContenedores() {
        return this.contenedores.length;
    }

    // Obtiene los detalles de todos los contenedores en la cuadrícula.
    getDetallesContenedores() {
        return this.contenedores.map(contenedor => ({
            id: contenedor.getId(),
            peso: contenedor.getPeso(),
            tipo: contenedor.getTexture(),
            posicion: contenedor.getPosition()
        }));
    }

    // Obtiene los contenedores que están en una área específica por ID.
    getContenedoresByAreaId(areaId) {
        const area = this.areas.find(area => area.id === areaId);
        if (area) {
            return this.contenedores.filter(contenedor => {
                const pos = contenedor.getPosition();
                return pos.x >= area.x && pos.x < area.x + area.width &&
                    pos.y >= area.y && pos.y < area.y + area.height;
            });
        }
        return [];
    }

    // Obtiene el peso total de los contenedores en una área específica por ID.
    getPesoByAreaId(areaId) {
        const contenedores = this.getContenedoresByAreaId(areaId);
        return contenedores.reduce((total, contenedor) => total + contenedor.getPeso(), 0);
    }

    // Obtiene un contenedor por su sprite.
    getContenedorBySprite(sprite) {
        return this.contenedores.find(contenedor => contenedor.sprite === sprite);
    }
    getContenedorById(id) {
        return this.contenedores.find(contenedor => contenedor.getId() === id);
    }
    
    
}
