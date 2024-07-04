let mysql = require("mysql");

let conexion = new mysql.createConnection({
    host: "localhost",
    database: "proyecto_s.c.b",
    user: "root",
    password: ""
});

conexion.connect(function(err){
    if(err) {
        throw err;
    } else {
        console.log("Conexion Establecida");
    }
});

conexion.end();

