export class Contenedor {
    constructor(scene, x, y, texture, scale, peso, id) {
        this.scene = scene;
        this.sprite = scene.add.image(x, y, texture);
        this.sprite.setScale(scale);
        this.sprite.setInteractive();
        this.sprite.id = id; // Asignar un ID incremental
        this.sprite.peso = peso; // Asignar el peso al contenedor

        // Añadir etiqueta de texto para el peso
        this.text = scene.add.text(x, y, `${peso}t`, {
            fontSize: '24px', fill: '#000', fontStyle: 'bold', stroke: '#fff', strokeThickness: 2
        });
        this.text.setOrigin(0.5, 0.5); // Centrar el texto

        // Hacer que el texto siga al contenedor
        scene.input.setDraggable(this.sprite);
        this.sprite.on('drag', this.handleDrag.bind(this));
    }

    handleDrag(pointer, dragX, dragY) {
        this.sprite.x = dragX;
        this.sprite.y = dragY;
        this.updateTextPosition(dragX, dragY);
    }

    updateTextPosition(x, y) {
        this.text.x = x;
        this.text.y = y;
    }

    destroy() {
        this.sprite.destroy();
        this.text.destroy();
    }

    getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    getPeso() {
        return this.sprite.peso;
    }

    getId() {
        return this.sprite.id;
    }

    setPosition(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
        this.updateTextPosition(x, y);
    }

    getTexture() {
        return this.sprite.texture.key;
    }
}
