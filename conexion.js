let mysql = require("mysql");

let conexion = new mysql.createConnection({
    host: "",
    database: "",
    user: "",
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

