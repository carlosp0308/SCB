let mysql = require("mysql");

let conexion = new mysql.createConnection({
    host: "127.0.0.1",
    port: "3306",
    database: "proyecto_s.c.b",
    user: "root",
    password: "admin"
});

conexion.connect(function(err){
    if(err) {
        throw err;
    } else {
        console.log("Conexion Establecida");
    }
});

conexion.end();

