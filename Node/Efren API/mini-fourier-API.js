const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const port = 3000;

// Configurar CORS
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());  // Analizar las solicitudes JSON

// Middleware para establecer cabeceras CORS
function setCorsHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}

app.use(setCorsHeaders);

// Función para ejecutar comandos en Maxima y obtener los resultados
function execMaxima(command, callback) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Maxima command: ${stderr}`);
            callback(error, null);
        } else {
            const result = stdout.trim();
            callback(null, result);
        }
    });
}

// RUTA PARA CALCULAR SERIE TRINGONOMÉTRICA PARA UNA FUNCIÓN DE UN SOLO TROZO
app.post('/fourier/entirely-continuous/trigonometric', (req, res) => {
    const { funcion, periodo } = req.body;

    // Comandos para los coeficientes
    const command_a0 = `echo declare(n, integer)$ string(ratsimp(((1/((${periodo})/2)) * integrate(${funcion}, x, -(${periodo}/2), ${periodo}/2)))); | maxima --very-quiet -`;
    const command_an = `echo declare(n, integer)$ string(ratsimp(((1/((${periodo})/2)) * integrate(((${funcion}) * cos((n*%pi*x)/((${periodo}/2)))), x, -(${periodo}/2), ${periodo}/2)))); | maxima --very-quiet -`;
    const command_bn = `echo declare(n, integer)$ string(ratsimp(((1/((${periodo})/2)) * integrate(((${funcion}) * sin((n*%pi*x)/((${periodo}/2)))), x, -(${periodo}/2), ${periodo}/2)))); | maxima --very-quiet -`;

    // Calcular a0, an y bn
    execMaxima(command_a0, (error_a0, a0) => {
        if (error_a0) {
            res.status(500).send({ error: `Error calculating a0: ${error_a0.message}` });
            return;
        }
        execMaxima(command_an, (error_an, an) => {
            if (error_an) {
                res.status(500).send({ error: `Error calculating an: ${error_an.message}` });
                return;
            }
            execMaxima(command_bn, (error_bn, bn) => {
                if (error_bn) {
                    res.status(500).send({ error: `Error calculating bn: ${error_bn.message}` });
                    return;
                }

                // Enviar los coeficientes como respuesta en formato JSON
                res.json({ a0, an, bn });
            });
        });
    });
    console.log("Se ha calculado la serie trigonometrica");
});

// RUTA PARA CALCULAR SERIE EXPONENCIAL PARA UNA FUNCIÓN DE UN SOLO TROZO 
app.post('/fourier/entirely-continuous/complex', (req, res) => {
    const { funcion, periodo } = req.body;

    // Aquí puedes definir los comandos específicos para la serie exponencial
    const command_c0 = `echo declare(n, integer)$ tellsimpafter(exp(%i*%pi*n), (-1)**n)$ tellsimpafter(exp(%i*2*%pi*n),1)$ string(ratsimp((1/(${periodo})) * integrate((${funcion}), x ,-((${periodo})/2), ((${periodo})/2)))); | maxima --very-quiet -`;
    const command_cn = `echo declare(n, integer)$ tellsimpafter(exp(%i*%pi*n), (-1)**n)$ tellsimpafter(exp(%i*2*%pi*n),1)$ string(ratsimp((1/(${periodo})) * integrate((${funcion}) * (exp(-(%i*n*%pi*x)/(((${periodo})/2)))), x ,-((${periodo})/2), ((${periodo})/2)))); | maxima --very-quiet -`;

    execMaxima(command_c0, (error_c0, c0) => {
        if (error_c0) {
            res.status(500).send({ error: `Error calculating cn: ${error_c0.message}` });
            return;
        }
        execMaxima(command_cn, (error_cn, cn) => {
            if (error_cn) {
                res.status(500).send({ error: `Error calculating cn: ${error_cn.message}` });
                return;
            }
            // Enviar el coeficiente c0 y cn
            res.json({ c0, cn });
        });
    });
});

// Añadir más rutas para otros tipos de series

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
