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
    let titulo = this.add.text(this.scale.width / 2, 100, "SCB", {
      font: "64px Arial",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 5,
      shadow: { offsetX: 2, offsetY: 2, color: "#000000", blur: 4 },
      align: "center",
    });
    titulo.setOrigin(0.5, 0); // Centra el texto horizontalmente en el punto dado

    // Subtítulo
    let subtitulo = this.add.text(
      this.scale.width / 2,
      titulo.y + 80,
      "(Simulador de Carga en Buques)",
      {
        font: "28px Arial",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
        shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 2 },
        align: "center",
      }
    );
    subtitulo.setOrigin(0.5, 0); // Centra el texto horizontalmente en el punto dado

    // Botón de inicio
    let botonInicio = this.add
      .text(this.scale.width / 2 - 100, this.scale.height - 100, "Iniciar", {
        font: "36px Arial",
        fill: "#ffffff",
        backgroundColor: "#ffcc00", // Color de fondo del botón
        padding: { x: 30, y: 15 }, // Espaciado dentro del botón
        border: "2px solid #000000", // Borde del botón
        align: "center",
      })
      .setInteractive();

    botonInicio.setOrigin(0.5, 0.5); // Centra el texto horizontal y verticalmente

    // Añadir efecto de hover
    botonInicio.on("pointerover", () => {
      botonInicio.setStyle({
        fill: "#000000",
        backgroundColor: "#ffff00", // Cambia el color de fondo cuando el ratón está sobre el botón
      });
    });

    botonInicio.on("pointerout", () => {
      botonInicio.setStyle({
        fill: "#ffffff",
        backgroundColor: "#ffcc00", // Restaura el color de fondo original
      });
    });

    // Acción al hacer clic en el botón
    botonInicio.on("pointerdown", () => {
      this.scene.start("IngresarDatos");
    });

    // Botón de tutorial
    let botonTutorial = this.add
      .text(this.scale.width / 2 + 100, this.scale.height - 100, "Tutorial", {
        font: "36px Arial",
        fill: "#ffffff",
        backgroundColor: "#ffcc00", // Color de fondo del botón
        padding: { x: 30, y: 15 }, // Espaciado dentro del botón
        border: "2px solid #000000", // Borde del botón
        align: "center",
      })
      .setInteractive();

    botonTutorial.setOrigin(0.5, 0.5); // Centra el texto horizontal y verticalmente

    // Añadir efecto de hover
    botonTutorial.on("pointerover", () => {
      botonTutorial.setStyle({
        fill: "#000000",
        backgroundColor: "#ffff00", // Cambia el color de fondo cuando el ratón está sobre el botón
      });
    });

    botonTutorial.on("pointerout", () => {
      botonTutorial.setStyle({
        fill: "#ffffff",
        backgroundColor: "#ffcc00", // Restaura el color de fondo original
      });
    });

    // Acción al hacer clic en el botón
    botonTutorial.on("pointerdown", () => {
      window.open(
        "https://docs.google.com/document/d/117jzJvi8yAWXEFkOD5fmzlXb6bsDUgDEEFQZNC9AuWI/edit",
        "_blank"
      );
    });
  }
}
