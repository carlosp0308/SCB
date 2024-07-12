const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Asegúrate de tener cors instalado

const app = express();
const port = 3000; // Cambiar el puerto si es necesario

app.use(bodyParser.json());
app.use(cors()); // Para permitir solicitudes CORS

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'proyecto_s.c.b'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta para cargar datos
app.get('/api/cargar', (req, res) => {
    let sql = 'SELECT nombre, json_data FROM contenedores';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results.map(result => ({ nombre: result.nombre, data: JSON.parse(result.json_data) })));
    });
});

// Ruta para guardar datos
app.post('/api/guardar', (req, res) => {
    const { nombre, data } = req.body;

    // Verificar si el nombre ya existe
    let checkSql = 'SELECT * FROM contenedores WHERE nombre = ?';
    db.query(checkSql, [nombre], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            // El nombre ya existe
            return res.status(400).json({ message: 'El nombre ya existe. Por favor elige otro.' });
        } else {
            // El nombre no existe, insertar el nuevo guardado
            let insertSql = 'INSERT INTO contenedores (nombre, json_data) VALUES (?, ?)';
            db.query(insertSql, [nombre, JSON.stringify(data)], (err, results) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.json({ message: 'Datos guardados correctamente' });
            });
        }
    });
});

// Ruta para obtener todos los nombres de guardados
app.get('/api/guardados', (req, res) => {
    let sql = 'SELECT nombre FROM contenedores';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results.map(result => result.nombre));
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
