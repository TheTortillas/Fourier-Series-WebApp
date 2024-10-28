
const express = require("express");
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
var cors = require('cors')

const app = express();
const port = 3000;

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

  function setCorsHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}

var integral = '';
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(setCorsHeaders);


app.post('/login', cors(corsOptions), (req, res) =>{
    var y = req.body;
    var funcion = y.nombre;
    

    const command = `echo declare(n, integer)$ string(integrate(${funcion}, x)); | maxima --very-quiet -`;
console.log(funcion);
    try{
        exec(command, (error, stdout, stderr) => {
        // Maneja errores de ejecución del comando
        if (error) {
            res.send(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        integral = stdout.trim();
        res.send(JSON.stringify(integral));
        }); 
    }catch(ex){
        res.send(JSON.stringify(ex));

    }
});


app.listen(port, () => {
    console.log("Corriendo el node en el puerto " + port);
});

class Usuario{
     nombre;
     apellido;
}
