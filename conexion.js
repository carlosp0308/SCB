// Importar el paquete mysql
const mysql = require('mysql');

// Configurar los parámetros de conexión
const conexion = mysql.createConnection({
    host: 'tu_host',
    user: 'tu_usuario',
    password: 'tu_contraseña',
    database: 'tu_base_de_datos'
});

// Conectar a la base de datos
conexion.connect((error) => {
    if (error) {
        console.error('Error al conectar a la base de datos:', error);
        return;
    }
    console.log('Conexión establecida correctamente');
    
    // Aquí puedes realizar consultas u otras operaciones
});

// Ejemplo de consulta
conexion.query('SELECT * FROM tu_tabla', (error, resultados, campos) => {
    if (error) {
        console.error('Error al ejecutar la consulta:', error);
        return;
    }
    console.log('Resultados de la consulta:', resultados);
});

// Cerrar la conexión al finalizar
conexion.end();
