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
    const func = req.body.function;  // La función recibida del formulario
    const period = req.body.period;  // El periodo recibido del formulario

    // Asegúrate de que el periodo esté entre paréntesis cuando se utilice en el denominador
    const command_a0 = `echo declare(n, integer)$ string(((1/(${period})) * integrate(${func}, x, -(${period}/2), ${period}/2))); | maxima --very-quiet -`;
    const command_an = `echo declare(n, integer)$ string(((2/(${period})) * integrate(${func} * cos(2 * %pi * n * x / (${period})), x, -(${period}/2), ${period}/2))); | maxima --very-quiet -`;
    const command_bn = `echo declare(n, integer)$ string(((2/(${period})) * integrate(${func} * sin(2 * %pi * n * x / (${period})), x, -(${period}/2), ${period}/2))); | maxima --very-quiet -`;
    // Función auxiliar para ejecutar comandos y capturar errores
    const execMaxima = (command, callback) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Maxima command: ${stderr}`);
                callback(error, null);
            } else {
                const result = stdout.trim(); // Limpia la salida
                callback(null, result);
            }
        });
    };

    // Ejecuta el comando para a_0
    execMaxima(command_a0, (error_a0, a0) => {
        if (error_a0) {
            res.send(`Error calculating a0: ${error_a0.message}`);
            return;
        }

        // Ejecuta el comando para a_n
        execMaxima(command_an, (error_an, a1) => {
            if (error_an) {
                res.send(`Error calculating an: ${error_an.message}`);
                return;
            }

            // Ejecuta el comando para b_n
            execMaxima(command_bn, (error_bn, b1) => {
                if (error_bn) {
                    res.send(`Error calculating bn: ${error_bn.message}`);
                    return;
                }

                // Redirige al cliente con los resultados de los coeficientes en la URL
                console.log("Función f(x):", func);
                console.log("Periodo T:", period);
                console.log("a0: ", command_a0);
                console.log("an: ", command_an);
                console.log("bn: ", command_bn);
                console.log("Coeficiente a0:", a0);
                console.log("Coeficiente an:", a1);
                console.log("Coeficiente bn:", b1);
                console.log("-----------------------------------------");
                // Eliminamos el uso de encodeURIComponent
                res.redirect(`/?a0=${a0}&a1=${a1}&b1=${b1}`);
            });
        });
    });
});


// Define el puerto en el que se ejecutará el servidor
const port = 3000;

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
