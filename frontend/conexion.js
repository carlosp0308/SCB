const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Para manejar rutas de archivos

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Configuración de la conexión a la base de datos
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

// Ruta para la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Asegúrate de que 'index.html' está en el mismo directorio
});

// Rutas de la API
app.get('/api/cargar', (req, res) => {
    let sql = 'SELECT nombre, json_data FROM contenedores';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results.map(result => ({ nombre: result.nombre, data: JSON.parse(result.json_data) })));
    });
});


app.post('/api/guardar', (req, res) => {
    const { nombre, data } = req.body;

    let checkSql = 'SELECT * FROM contenedores WHERE nombre = ?';
    db.query(checkSql, [nombre], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'El nombre ya existe. Por favor elige otro.' });
        } else {
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

app.get('/api/guardados', (req, res) => {
    let sql = 'SELECT nombre FROM contenedores';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results.map(result => result.nombre));
    });
});

// Iniciar el servidor de Express
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
