const mysql = require('mysql');

class MySQLConnection {
    constructor(config) {
        this.config = config;
        this.connection = null;
    }

    connect() {
        this.connection = mysql.createConnection(this.config);
        
        this.connection.connect((error) => {
            if (error) {
                console.error('Error al conectar a la base de datos:', error);
                return;
            }
            console.log('Conexión establecida correctamente');
        });
    }

    query(sql, callback) {
        this.connection.query(sql, (error, results, fields) => {
            if (error) {
                console.error('Error al ejecutar la consulta:', error);
                callback(error, null);
                return;
            }
            callback(null, results);
        });
    }

    close() {
        this.connection.end((error) => {
            if (error) {
                console.error('Error al cerrar la conexión:', error);
                return;
            }
            console.log('Conexión cerrada correctamente');
        });
    }
}

// Ejemplo de uso de la clase MySQLConnection
const config = {
    host: 'tu_host',
    user: 'tu_usuario',
    password: 'tu_contraseña',
    database: 'tu_base_de_datos'
};

const db = new MySQLConnection(config);
db.connect();

// Ejemplo de consulta
db.query('SELECT * FROM tu_tabla', (error, resultados) => {
    if (error) {
        console.error('Error al ejecutar la consulta:', error);
        return;
    }
    console.log('Resultados de la consulta:', resultados);
});

// Cerrar la conexión al finalizar
db.close();
