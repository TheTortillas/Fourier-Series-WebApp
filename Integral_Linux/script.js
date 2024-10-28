// Importa el módulo Express
const express = require('express');

// Importa el módulo body-parser
const bodyParser = require('body-parser');

// Importa el método exec del módulo child_process
const { exec } = require('child_process');

// Importa el módulo path
const path = require('path');

// Crea una instancia de la aplicación Express
const app = express();

// Usa body-parser para analizar las solicitudes con codificación de formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Establece la carpeta 'public' como una carpeta estática
app.use(express.static(path.join(__dirname, 'public')));

// Maneja las solicitudes GET al punto de acceso raíz
app.get('/', (req, res) => {
    // Envía el archivo index.html al cliente
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Maneja las solicitudes POST al punto de acceso raíz
app.post('/', (req, res) => {
    // Obtiene la función matemática de la solicitud POST
    let func = req.body.function;

    // Reemplaza ^ por ** en la función no necesario en Ubuntu
    //func = func.replace(/\^/g, '**');

    // Crea un comando Maxima  Windows
    //const command = `echo declare(n, integer)$ string(integrate(${func}, x)); | maxima --very-quiet`;
    
    // Comando para Maxima Ubuntu
    const command = `echo "declare(n, integer)$ string(integrate(${func}, x));" | maxima --very-quiet`;
    console.log("Comando:", command);

    // Ejecuta el comando Maxima
    exec(command, (error, stdout, stderr) => {
        // Maneja errores de ejecución del comando
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            // Envía un mensaje de error al cliente
            res.send(`Error: ${error.message}`);
            return;
        }
        // Muestra cualquier salida de error estándar
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        // Codifica el resultado antes de redirigir
        console.log("Respuesta:", stdout);
        // Redirige al cliente de vuelta al punto de acceso raíz con el resultado de la integral en la URL
        res.redirect(`/?integral=${stdout}`);
    });
});


// Define el puerto en el que se ejecutará el servidor
const port = 3000;

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
    // Muestra un mensaje en la consola cuando el servidor está en funcionamiento
    console.log(`Server running at http://localhost:${port}`);
    //console.log(`Server running at http://192.168.1.196:${port}`);
});
