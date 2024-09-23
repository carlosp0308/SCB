export class IngresarDatos extends Phaser.Scene {
    constructor() {
        super({ key: "IngresarDatos" });
    }

    preload() {
        this.load.css('bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css');
    }

    create() {
        // Crear y agregar los formularios dentro de un contenedor principal
        const formHTML = `
            <div id="formContainer" style="
                display: flex; 
                justify-content: flex-start; 
                align-items: flex-start; 
                position: absolute; 
                top: 50%; 
                left: 50%;
                transform: translate(-50%, -50%);
                gap: 20px; /* Espacio entre los formularios */
                z-index: 10;
            ">
                <!-- Formulario de ingreso de datos -->
                <form id="dataForm" style="
                    width: 280px; 
                    padding: 15px; 
                    background-color: #f0f0f0;
                    border: 2px solid #ccc;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                ">
                    <div class="form-group">
                        <label for="peso" class="control-label">Peso total(2,3 - 27,3 toneladas):</label>
                        <input type="number" id="peso" class="form-control" min="2.3" max="27.3" step="0.1" value="2.3"><br>
                        <label for="cantidad" class="control-label">Cantidad:</label>
                        <input type="number" id="cantidad" class="form-control" min="1" value="1"><br>
                        <label for="tipo" class="control-label">Tipo:</label>
                        <select id="tipo" class="form-control">
                            <option value="contenedor-blanco">Tipo A</option>
                            <option value="contenedor-azul">Tipo B</option>
                        </select>
                    </div>
                    <button type="button" id="agregarButton" class="btn btn-primary btn-sm">Agregar</button><br><br>
                    <button type="button" id="confirmarButton" class="btn btn-success btn-sm">Confirmar</button>
                </form>

                <!-- Formulario para mostrar los contenedores agregados -->
                <div id="resumenContainer" style="
                    width: 230px; 
                    padding: 15px; 
                    background-color: #e9ecef;
                    border: 2px solid #ccc;
                    border-radius: 8px;
                    max-height: 400px; 
                    overflow-y: auto;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                ">
                    <h5>Contenedores Agregados</h5>
                    <ul id="resumenLista" class="list-group" style="width: 100%;"></ul>
                    <button type="button" id="eliminarButton" class="btn btn-danger btn-sm mt-2">Eliminar último</button>
                </div>
            </div>
        `;

        // Crear un contenedor y añadir el formulario dentro del contenedor de Phaser
        const formContainer = document.createElement('div');
        formContainer.innerHTML = formHTML;

        // Agregar el contenedor del formulario dentro del contenedor del canvas de Phaser
        const phaserContainer = document.getElementsByTagName('canvas')[0].parentNode;
        phaserContainer.style.position = 'relative'; // Asegurar que el contenedor de Phaser esté relativo
        phaserContainer.appendChild(formContainer);

        // Alinear y centrar el formulario basado en las dimensiones del canvas
        this.centerForm(formContainer);

        // Ajustar la posición del formulario al cambiar el tamaño de la ventana
        window.addEventListener('resize', () => this.centerForm(formContainer));

        // Lógica del botón "Agregar otro contenedor"
        document.getElementById('agregarButton').addEventListener('click', () => {
            const peso = parseFloat(document.getElementById('peso').value);
            const cantidad = parseInt(document.getElementById('cantidad').value);
            const tipo = document.getElementById('tipo').value;

            // Añadir a la lista de contenedores
            const contenedor = { peso, cantidad, tipo };
            this.agregarAResumen(contenedor);

            // Reiniciar formulario
            document.getElementById('dataForm').reset();
        });

        // Botón de eliminar último contenedor
        document.getElementById('eliminarButton').addEventListener('click', () => {
            const resumenLista = document.getElementById('resumenLista');
            if (resumenLista.children.length > 0) {
                resumenLista.removeChild(resumenLista.lastChild);
            }
        });

        // Botón de confirmar
        document.getElementById('confirmarButton').addEventListener('click', () => {
            const listaContenedores = Array.from(document.getElementById('resumenLista').children).map(li => {
                return JSON.parse(li.dataset.contenedor);
            });

            // Pasar los datos a la escena Simulador
            this.scene.start('Simulador', { data: listaContenedores });

            // Eliminar el formulario después de confirmar
            this.shutdown();
        });
    }

    agregarAResumen(contenedor) {
        const resumenLista = document.getElementById('resumenLista');
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `Peso: ${contenedor.peso} toneladas, Cantidad: ${contenedor.cantidad}, Tipo: ${contenedor.tipo}`;
        li.dataset.contenedor = JSON.stringify(contenedor);
        resumenLista.appendChild(li);
    }

    centerForm(formContainer) {
        // Calcular la posición para centrar el contenedor del formulario dentro del contenedor de Phaser
        const canvas = this.sys.game.canvas;
        const canvasBounds = canvas.getBoundingClientRect();

        // Ajustar el contenedor del formulario para centrarlo en el canvas de Phaser
        formContainer.style.position = 'absolute';
        formContainer.style.left = `${canvasBounds.left + canvasBounds.width / 2}px`;
        formContainer.style.top = `${canvasBounds.top + canvasBounds.height / 2}px`;
        formContainer.style.transform = 'translate(-50%, -50%)';
    }

    shutdown() {
        const formElement = document.getElementById('formContainer');
        if (formElement) {
            formElement.remove();
        }
    }
}
