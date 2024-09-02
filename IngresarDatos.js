

export class IngresarDatos extends Phaser.Scene {
    constructor() {
        super({ key: "IngresarDatos" });
    }

    preload() {
        this.load.image("confirmar", "images/confirmar.png");
        this.load.css('bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css');
    }

    create() {
        

        // Agregar el formulario de ingreso de datos
        const formHTML = `
            <form id="dataForm" style="position: absolute; top: 50px; left: 50px;">
                <div id="contenedores">
                    <div class="contenedor form-group">
                        <label for="peso" class="control-label">Peso (1-10 toneladas):</label>
                        <input type="number" class="form-control peso" min="1" max="10" step="0.1" value="1"><br>
                        <label for="cantidad" class="control-label">Cantidad:</label>
                        <input type="number" class="form-control cantidad" min="1" value="1"><br>
                        <label for="tipo" class="control-label">Tipo:</label>
                        <select class="form-control tipo">
                            <option value="contenedor-blanco">Tipo A</option>
                            <option value="contenedor-azul">Tipo B</option>
                        </select>
                    </div>
                </div>
            <button type="button" id="agregarButton" class="btn btn-primary">Agregar otro contenedor</button><br><br>
            <button type="button" id="confirmarButton" class="btn btn-success">Confirmar</button>
            </form>
        `;
        const formElement = document.createElement('div');
        formElement.innerHTML = formHTML;
        document.body.appendChild(formElement);

        // Agregar funcionalidad al botón "Agregar otro contenedor"
        document.getElementById('agregarButton').addEventListener('click', () => {
            const contenedoresDiv = document.getElementById('contenedores');
            const newContenedorHTML = `
                <div class="contenedor form-group">
                    <label for="peso" class="control-label">Peso (1-10 toneladas):</label>
                    <input type="number" class="form-control peso" min="1" max="10" step="0.1" value="1"><br>
                    <label for="cantidad" class="control-label">Cantidad:</label>
                    <input type="number" class="form-control cantidad" min="1" value="1"><br>
                    <label for="tipo" class="control-label">Tipo:</label>
                    <select class="form-control tipo">
                        <option value="contenedor-blanco">Tipo A</option>
                        <option value="contenedor-azul">Tipo B</option>
                        </select>
                </div>
            `;
            const newContenedorElement = document.createElement('div');
            newContenedorElement.innerHTML = newContenedorHTML;
            contenedoresDiv.appendChild(newContenedorElement);
        });

        // Botón de confirmar
        document.getElementById('confirmarButton').addEventListener('click', () => {
            const pesos = Array.from(document.getElementsByClassName('peso')).map(input => parseFloat(input.value));
            const cantidades = Array.from(document.getElementsByClassName('cantidad')).map(input => parseInt(input.value));
            const tipos = Array.from(document.getElementsByClassName('tipo')).map(select => select.value);
            const data = pesos.map((peso, index) => ({ peso, cantidad: cantidades[index], tipo: tipos[index] }));

            // Pasar los datos a la escena Simulador
            this.scene.start('Simulador', { data });

            // Eliminar el formulario después de confirmar
            this.shutdown();
        });
    }

    shutdown() {
        // Eliminar el formulario cuando la escena se cierra
        const formElement = document.getElementById('dataForm');
        if (formElement) {
            formElement.remove();
        }
    }
}
