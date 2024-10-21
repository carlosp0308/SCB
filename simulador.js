import { Contenedor } from "./contenedor.js";
import { Cuadricula } from "./cuadricula.js";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

const AREA_WIDTH = 5;
const AREA_HEIGHT = 10;
const SEPARATION = 65;
const SEPARATION2 = 20;

const AREAS = [
  { x: 50, y: 70, width: 250, height: 400 },
  ...Array.from({ length: 6 }, (_, row) =>
    Array.from({ length: 13 }, (_, col) => ({
      x: 275 + col * (AREA_WIDTH + SEPARATION),
      y: 530 + row * (AREA_HEIGHT + SEPARATION2),
      width: AREA_WIDTH,
      height: AREA_HEIGHT,
    }))
  ).flat(),
];
const positions = [
  { x: 50, y: 70 },
  { x: 120, y: 70 },
  { x: 190, y: 70 },
  { x: 260, y: 70 },
  { x: 50, y: 100 },
  { x: 120, y: 100 },
  { x: 190, y: 100 },
  { x: 260, y: 100 },
  { x: 50, y: 130 },
  { x: 120, y: 130 },
  { x: 190, y: 130 },
  { x: 260, y: 130 },
  { x: 50, y: 160 },
  { x: 120, y: 160 },
  { x: 190, y: 160 },
  { x: 260, y: 160 },
  { x: 50, y: 190 },
  { x: 120, y: 190 },
  { x: 190, y: 190 },
  { x: 260, y: 190 },
  { x: 50, y: 210 },
  { x: 120, y: 210 },
  { x: 190, y: 210 },
  { x: 260, y: 210 },
  { x: 50, y: 240 },
  { x: 120, y: 240 },
  { x: 190, y: 240 },
  { x: 260, y: 240 },
  { x: 50, y: 270 },
  { x: 120, y: 270 },
  { x: 190, y: 270 },
  { x: 260, y: 270 },
  { x: 50, y: 300 },
  { x: 120, y: 300 },
  { x: 190, y: 300 },
  { x: 260, y: 300 },
  { x: 50, y: 340 },
  { x: 120, y: 340 },
  { x: 190, y: 340 },
  { x: 260, y: 340 },
  { x: 50, y: 370 },
  { x: 120, y: 370 },
  { x: 190, y: 370 },
  { x: 260, y: 370 },
  { x: 50, y: 400 },
  { x: 120, y: 400 },
  { x: 190, y: 400 },
  { x: 260, y: 400 },
  { x: 50, y: 430 },
  { x: 120, y: 430 },
  { x: 190, y: 430 },
  { x: 260, y: 430 },
  { x: 50, y: 460 },
  { x: 120, y: 460 },
  { x: 190, y: 460 },
  { x: 260, y: 460 },
];

export class Simulador extends Phaser.Scene {
  constructor() {
    super({ key: "Simulador" });
    this.cuadricula = new Cuadricula(this, AREAS);
    this.containerId = 1; // ID incremental para los contenedores
    this.positionIndex = 0; // Índice para las posiciones de los contenedores
  }

  preload() {
    this.load.image(
      "Contenedor Ventilado-Blanco",
      "images/Contenedor Ventilado-Blanco.png"
    );
    this.load.image(
      "Contenedor Estándar-Azul",
      "images/Contenedor Estándar-Azul.png"
    );
    this.load.image("buque", "images/buque.png");

    this.load.scenePlugin({
      key: "rexuiplugin",
      url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      sceneKey: "rexUI",
    });
  }

  create(data) {
    this.add.image(675, 620, "buque");
    this.cuadricula.drawAreas();

    this.createTextIndicators();  // Llamar al método para agregar las etiquetas de las partes del buque
    this.createButtons();
   
    

    // Crear contenedores basados en los datos recibidos
    if (data) {
      this.createContainers(data.data);
    }

    // Registrar eventos de arrastre.
    this.input.on("drag", this.handleDrag, this);
    this.input.on("dragend", this.handleDragEnd, this);
  }

   // Método para crear los textos indicadores en el buque
  createTextIndicators() {
 
    this.add.text(675, 490, '← Babor →', {
      fontSize: '24px',
      fill: '#ffffff',
      fontWeight: 'bold',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setOrigin(0.5);  // Centrado

    
    this.add.text(675, 720, '← Estribor →', {
      fontSize: '24px',
      fill: '#ffffff',
      fontWeight: 'bold',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setOrigin(0.5);  // Centrado

  
    this.add.text(60, 600, 'Popa↑↓', {
      fontSize: '24px',
      fill: '#ffffff',
      fontWeight: 'bold',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setOrigin(0.5);  // Centrado

  
    this.add.text(1350, 600, '↑↓Proa', {
      fontSize: '24px',
      fill: '#ffffff',
      fontWeight: 'bold',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setOrigin(0.5);  // Centrado
  }




  createButtons() {
    const buttonHeight = 30; // Altura de los botones
    const baseY = this.cameras.main.height - 20; // Base para la posición Y de los botones

    this.createStyledButton(
      100,
      baseY,
      "Guardar",
      this.promptForSaveName,
      buttonHeight
    );
    this.createStyledButton(
      250,
      baseY,
      "Cargar",
      this.showLoadOptions,
      buttonHeight
    );
    this.createStyledButton(
      400,
      baseY,
      "Volver",
      this.handleVolverButton.bind(this),
      buttonHeight
    );
    this.createStyledButton(
      800,
      baseY,
      "Comprobar Distribución",
      this.comprobarUbicaciones.bind(this),
      buttonHeight
    );
    this.createStyledButton(
      1100,
      baseY,
      "Distribución Óptima",
      this.reubicarContenedores.bind(this),
      buttonHeight
    );

    // Nuevo botón "Ayuda" en la parte superior derecha
    this.createStyledButton(
      this.cameras.main.width - 100,  // Ubicación en X (cerca del borde derecho)
      40,  // Ubicación en Y (en la parte superior)
      "Ayuda",
      this.showHelpWindow.bind(this),  // Acción al hacer clic
      buttonHeight
    );
}
showHelpWindow() {
  // Crear un rectángulo oscuro como fondo semitransparente
  const background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5)
      .setOrigin(0, 0)
      .setInteractive(); // Asegurarse de que el fondo sea interactivo para que se pueda hacer clic fuera del cuadro de ayuda

  // Crear un cuadro de ayuda en el centro
  const helpWindow = this.add.rectangle(this.cameras.main.width / 1.5, this.cameras.main.height / 2.7, 800, 400, 0xffffff)
      .setStrokeStyle(2, 0x000000);

  // Texto dentro del cuadro de ayuda
  const helpText = this.add.text(this.cameras.main.width / 1.5, this.cameras.main.height / 2.5 - 200, 
      "Instrucciones del Sistema:\n\n" +
      "Puede arrastrar los contenedores para reorganizarlos en el área del buque.\n\n" +
      "Es aconsejable colocar más peso en las zonas centrales del buque que en los extremos.\n\n" +
      "Intente que el peso colocado en un sector sea similar al peso colocado en el sector opuesto.\n\n" +
      "El botón 'Comprobar Distribución' le indicará si debe colocar más peso en un sector determinado.\n\n" +
      "El botón 'Distribución Óptima' ubicará todos los contenedores con una distribución equilibrada.\n\n" +
      "El botón 'Guardar' le permitirá almacenar la distribución actual.\n\n" +
      "El botón 'Cargar' le permitirá restaurar una distribución guardada previamente.\n\n" +
      "El botón 'Volver' le permitirá regresar a la pantalla inicial.\n\n", 
      {
          fontSize: '18px',
          color: '#000000',
          align: 'left',
          wordWrap: { width: 780 } // Ajustar el texto para que se ajuste dentro del cuadro de ayuda
      }
  ).setOrigin(0.5, 0); // Centrar el texto horizontalmente

  // Crear un botón para cerrar la ventana de ayuda
  const closeButton = this.add.text(this.cameras.main.width / 1.52, this.cameras.main.height / 1.5, 'Cerrar', {
      fontSize: '20px',
      fontWeight: 'bold',
      fill: '#000000',
      backgroundColor: '#ffeb3b',
      padding: { x: 10, y: 5 },
      align: 'center'
  }).setOrigin(0.5, 0.5)
    .setInteractive()
    .on('pointerdown', () => {
      // Eliminar los elementos de la ventana de ayuda cuando se presione el botón "Cerrar"
      background.destroy();
      helpWindow.destroy();
      helpText.destroy();
      closeButton.destroy(); // Aquí destruimos el botón cerrar
    })
    .on('pointerover', () => closeButton.setStyle({ backgroundColor: '#ffc107' }))
    .on('pointerout', () => closeButton.setStyle({ backgroundColor: '#ffeb3b' }));
}

  createStyledButton(x, y, text, onClick, height) {
    const padding = 20; // Espaciado adicional a cada lado del texto
    const testText = this.add.text(0, 0, text, {
      fontSize: "20px",
      fontWeight: "bold",
    });
    const textWidth = testText.width;
    testText.destroy(); // Destruye el objeto de texto después de obtener su ancho

    const buttonWidth = textWidth + padding;

    // Crear un botón rectangular con fondo amarillo
    let button = this.add
      .rectangle(x, y, buttonWidth, height, 0xffeb3b)
      .setInteractive(); // Fondo amarillo
    button.setStrokeStyle(2, 0x000000); // Borde negro

    // Crear el texto centrado en el botón
    let buttonText = this.add
      .text(x, y, text, {
        fontSize: "20px",
        fill: "#000000", // Color del texto negro
        fontWeight: "bold",
      })
      .setOrigin(0.5, 0.5); // Asegúrate de centrar el texto

    // Ajustar el texto al centro del botón
    buttonText.setPosition(x, y); // Ya se centra con setOrigin(0.5, 0.5)

    // Agregar los eventos de interacción
    button.on("pointerdown", onClick, this);
    button.on("pointerover", () => {
      button.setFillStyle(0xffc107);
    });
    button.on("pointerout", () => {
      button.setFillStyle(0xffeb3b);
    });
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
    data.forEach((item) => {
      // Obtener la posición actual para el grupo de contenedores
      const pos = positions[this.positionIndex];

      // Para cada contenedor en el grupo (misma posición)
      for (let i = 0; i < item.cantidad; i++) {
        // Crear el contenedor en la posición actual (mismos x e y)
        const contenedor = new Contenedor(
          this,
          pos.x,
          pos.y,
          item.tipo,
          0.0125,
          item.peso,
          this.containerId++
        );
        this.cuadricula.addContenedor(contenedor);
      }

      // Incrementar el índice de la posición, volviendo al inicio si supera el límite
      this.positionIndex = (this.positionIndex + 1) % positions.length;
    });
  }

  loadContainerPositions(nombre) {
    this.cuadricula
      .getContenedores()
      .forEach((contenedor) => contenedor.destroy());
    this.cuadricula.contenedores = [];

    fetch("http://localhost:3000/api/cargar")
      .then((response) => response.json())
      .then((data) => {
        const savedData = data.find((item) => item.nombre === nombre);
        if (savedData) {
          savedData.data.forEach((containerData) => {
            const contenedor = new Contenedor(
              this,
              containerData.x,
              containerData.y,
              containerData.tipo,
              0.0125,
              containerData.peso,
              containerData.id
            );
            this.cuadricula.addContenedor(contenedor);
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  saveContainerPositions(nombre) {
    const data = this.cuadricula.getContenedores().map((cont) => ({
      x: cont.getPosition().x,
      y: cont.getPosition().y,
      id: cont.getId(),
      peso: cont.getPeso(),
      tipo: cont.getTexture(),
    }));

    fetch("http://localhost:3000/api/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, data }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  promptForSaveName() {
    const nombre = prompt("Ingrese el nombre para guardar:");
    if (nombre) {
      this.saveContainerPositions(nombre);
    }
  }

  showLoadOptions() {
    fetch("http://localhost:3000/api/guardados")
      .then((response) => response.json())
      .then((names) => {
        const selectedName = prompt(
          "Seleccione un guardado:\n" + names.join("\n")
        );
        if (selectedName) {
          this.loadContainerPositions(selectedName);
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  showInfoAreas() {
    const areasInfo = this.cuadricula.areas.map((area) => {
      const contenedores = this.cuadricula.getContenedoresByAreaId(area.id);
      const contenedoresInfo = contenedores.map((contenedor) => ({
        id: contenedor.getId(),
        peso: contenedor.getPeso(),
        tipo: contenedor.getTexture(),
      }));
      return {
        areaId: area.id,
        contenedores: contenedoresInfo,
      };
    });

    console.log(JSON.stringify(areasInfo, null, 2));
  }

  // Método para reubicar los contenedores
  reubicarContenedores() {
    const areasInfo = this.cuadricula.areas.map((area) => {
      const contenedores = this.cuadricula.getContenedoresByAreaId(area.id);
      const contenedoresInfo = contenedores.map((contenedor) => ({
        id: contenedor.getId(),
        peso: contenedor.getPeso(),
        tipo: contenedor.getTexture(),
      }));
      return {
        id: area.id,
        contenedores: contenedoresInfo,
      };
    });

    console.log(
      "Datos enviados al backend:",
      JSON.stringify({ areas: areasInfo }, null, 2)
    );

    fetch("http://localhost:8080/api/reubicacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ areas: areasInfo }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(
          "Datos recibidos del backend:",
          JSON.stringify(data, null, 2)
        );
        if (Array.isArray(data)) {
          data.forEach((newInfo) => {
            const contenedor = this.cuadricula.getContenedorById(newInfo.id);
            if (contenedor) {
              contenedor.setPosition(newInfo.x, newInfo.y);
              contenedor.sprite.peso = newInfo.peso;
              contenedor.sprite.setTexture(newInfo.tipo);
              contenedor.text.setText(`${newInfo.peso}t`);
            }
          });
        } else {
          console.error("Formato de respuesta inesperado:", data);
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  comprobarUbicaciones() {
    // Recolectar la información de las áreas como se hace en reubicarContenedores
    const areasInfo = this.cuadricula.areas.map((area) => {
      const contenedores = this.cuadricula.getContenedoresByAreaId(area.id);
      const contenedoresInfo = contenedores.map((contenedor) => ({
        id: contenedor.getId(),
        peso: contenedor.getPeso(),
        tipo: contenedor.getTexture(),
      }));
      return {
        id: area.id,
        contenedores: contenedoresInfo,
      };
    });

    // Enviar los datos al backend para comprobar las ubicaciones
    fetch("http://localhost:8080/api/reubicacion/comprobar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ areas: areasInfo }), // Enviar las áreas y contenedores
    })
      .then((response) => response.text()) // Esperar un texto como respuesta
      .then((message) => {
        // Mostrar el mensaje en una ventana emergente
        alert(message);
      })
      .catch((error) => console.error("Error:", error));
  }

  handleVolverButton() {
    this.resetScene(); // Llama a este nuevo método para limpiar la escena
    this.scene.start("Inicio"); // Luego cambia a la escena de inicio
  }

  resetScene() {
    // Borra todos los contenedores de la cuadrícula
    this.cuadricula
      .getContenedores()
      .forEach((contenedor) => contenedor.destroy());
    this.cuadricula.contenedores = []; // Limpia el arreglo de contenedores
  }
}
