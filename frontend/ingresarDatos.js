export class IngresarDatos extends Phaser.Scene {
    constructor() {
        super({ key: "IngresarDatos" });
        this.totalPeso = 0; // Campo para acumular el peso total
        this.maxPeso = 12000; // Peso máximo permitido
    }

    preload() {
        this.load.css('bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css');
    }

    create() {
        const formHTML = `
            <div id="formContainer" style="
                display: flex; 
                justify-content: flex-start; 
                align-items: flex-start; 
                position: absolute; 
                top: 50%; 
                left: 50%;
                transform: translate(-50%, -50%);
                gap: 20px;
                z-index: 10;
            ">
                <form id="dataForm" style="
                    width: 280px; 
                    padding: 15px; 
                    background-color: #f0f0f0;
                    border: 2px solid #ccc;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                ">
                    <div class="form-group">
                        <label for="peso" class="control-label">Peso total en el Contenedor (2,3 - 27,3 toneladas):</label>
                        <input type="number" id="peso" class="form-control" min="2.3" max="27.3" step="0.1" value="2.3"><br>
                        <label for="cantidad" class="control-label">Cantidad:</label>
                        <input type="number" id="cantidad" class="form-control" min="1" value="1"><br>
                        <label for="tipo" class="control-label">Tipo:</label>
                        <select id="tipo" class="form-control">
                            <option value="contenedor-20pies">Contenedor 20 pies estandar</option>
                            <option value="contenedor-40pies">Contenedor 40 pies estandar</option>
                        </select>
                    </div>
                    <button type="button" id="agregarButton" class="btn btn-primary btn-sm">Agregar</button><br><br>
                    <label id="pesoTotalLabel" class="control-label">Peso total acumulado: 0 toneladas</label><br><br> <!-- Etiqueta para mostrar el peso total -->
                    <button type="button" id="confirmarButton" class="btn btn-success btn-sm">Confirmar</button>
                </form>

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

        const formContainer = document.createElement('div');
        formContainer.innerHTML = formHTML;
        const phaserContainer = document.getElementsByTagName('canvas')[0].parentNode;
        phaserContainer.style.position = 'relative';
        phaserContainer.appendChild(formContainer);

        this.centerForm(formContainer);
        window.addEventListener('resize', () => this.centerForm(formContainer));

        document.getElementById('agregarButton').addEventListener('click', () => {
            const peso = parseFloat(document.getElementById('peso').value);
            const cantidad = parseInt(document.getElementById('cantidad').value);
            const tipo = document.getElementById('tipo').value;
            const totalContenedorPeso = peso * cantidad;

            // Verificar si al agregar este peso se supera el límite
            if (this.totalPeso + totalContenedorPeso > this.maxPeso) {
                alert('No se puede agregar el contenedor. El peso total excede las 12,000 toneladas.');
                return;
            }

            // Añadir a la lista de contenedores
            const contenedor = { peso, cantidad, tipo };
            this.agregarAResumen(contenedor);

            // Actualizar el peso total
            this.totalPeso += totalContenedorPeso;
            document.getElementById('pesoTotalLabel').textContent = `Peso total acumulado: ${this.totalPeso.toFixed(1)} toneladas`;

            // Reiniciar formulario
            document.getElementById('dataForm').reset();
        });

        document.getElementById('eliminarButton').addEventListener('click', () => {
            const resumenLista = document.getElementById('resumenLista');
            if (resumenLista.children.length > 0) {
                const lastChild = resumenLista.lastChild;
                const contenedor = JSON.parse(lastChild.dataset.contenedor);
                const totalContenedorPeso = contenedor.peso * contenedor.cantidad;

                // Restar el peso del contenedor eliminado
                this.totalPeso -= totalContenedorPeso;
                document.getElementById('pesoTotalLabel').textContent = `Peso total acumulado: ${this.totalPeso.toFixed(1)} toneladas`;

                resumenLista.removeChild(lastChild);
            }
        });

        document.getElementById('confirmarButton').addEventListener('click', () => {
            const listaContenedores = Array.from(document.getElementById('resumenLista').children).map(li => {
                return JSON.parse(li.dataset.contenedor);
            });

            this.scene.start('Simulador', { data: listaContenedores });
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
        const canvas = this.sys.game.canvas;
        const canvasBounds = canvas.getBoundingClientRect();
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
