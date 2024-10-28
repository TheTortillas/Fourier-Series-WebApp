window.onload = function () {
    const canvas = document.getElementById("canvas");
    //@type {CanvasRenderingContext2D} 
    const ctx = canvas.getContext("2d");
    // Lista global para almacenar las funciones graficadas
    let functionsList = [];
    let currentSeries = null;


    let width = canvas.width;
    let height = canvas.height;


    let unit = Math.max(75, Math.min(75, Math.floor(width / (500)))); // Changes when zoom

    let offsetX = 0;
    let offsetY = 0;

    ctx.font = "14px CMU Serif";
    bgColor = "#222";
    fontColor = "#EBEBEB";
    axisColor = "#90DCB5";
    gridColor = "#6BBCAC";

    let drag = false;
    let mouseX = 0;
    let mouseY = 0;


    let origin = {
        x: width / 2,
        y: height / 2
    };


    function drawScreen() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        const XAxis = {
            start: {
                x: 0,
                y: height / 2
            },
            end: {
                x: width,
                y: height / 2
            }
        };

        const YAxis = {
            start: {
                x: width / 2,
                y: 0
            },
            end: {
                x: width / 2,
                y: height
            }
        };

        origin = {
            x: width / 2,
            y: height / 2
        };

        drawAxes(XAxis, YAxis, axisColor);
        drawGrid(origin, XAxis, YAxis, unit, gridColor, fontColor);

        function drawAxes(XAxis, YAxis, axisColor) {
            ctx.beginPath();
            ctx.moveTo(XAxis.start.x, XAxis.start.y - offsetY);
            ctx.lineTo(XAxis.end.x, XAxis.end.y - offsetY);
            ctx.moveTo(YAxis.start.x - offsetX, YAxis.start.y);
            ctx.lineTo(YAxis.end.x - offsetX, YAxis.end.y);
            ctx.strokeStyle = axisColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        };

        function drawGrid(origin, XAxis, YAxis, unit, gridColor, fontColor) {
            ctx.strokeStyle = gridColor;
            ctx.fillStyle = fontColor;

            let cuadrosGrandesFrecuencia = (unit >= 65) ? 1 : 5;

            // Dibujar líneas verticales
            for (let i = -1000; i < 1000; i++) {
                const x = origin.x + unit * i - offsetX;

                if (unit >= 25 && cuadrosGrandesFrecuencia === 1) {
                    for (let j = 1; j < 5; j++) {
                        const smallX = x + unit * (j / 5);
                        ctx.beginPath();
                        ctx.moveTo(smallX, YAxis.start.y);
                        ctx.lineTo(smallX, YAxis.end.y);
                        ctx.lineWidth = 0.25;
                        ctx.stroke();
                    }
                }

                ctx.beginPath();
                ctx.moveTo(x, YAxis.start.y);
                ctx.lineTo(x, YAxis.end.y);
                ctx.lineWidth = (i % cuadrosGrandesFrecuencia === 0) ? 1 : 0.25;
                ctx.stroke();

                if (i !== 0 && i % cuadrosGrandesFrecuencia === 0) {
                    ctx.fillText(i, x, origin.y - offsetY);
                }
            }

            // Dibujar líneas horizontales
            for (let i = -1000; i < 1000; i++) {
                const y = origin.y + unit * i - offsetY;

                if (unit >= 25 && cuadrosGrandesFrecuencia === 1) {
                    for (let j = 1; j < 5; j++) {
                        const smallY = y + unit * (j / 5);
                        ctx.beginPath();
                        ctx.moveTo(XAxis.start.x, smallY);
                        ctx.lineTo(XAxis.end.x, smallY);
                        ctx.lineWidth = 0.25;
                        ctx.stroke();
                    }
                }

                ctx.beginPath();
                ctx.moveTo(XAxis.start.x, y);
                ctx.lineTo(XAxis.end.x, y);
                ctx.lineWidth = (i % cuadrosGrandesFrecuencia === 0) ? 1 : 0.25;
                ctx.stroke();

                if (i !== 0 && i % cuadrosGrandesFrecuencia === 0) {
                    ctx.fillText(-i, origin.x - offsetX, y);
                }
            }
        }

        // Llamar a las funciones desde drawScreen()
        drawFunction(function (x) { return x * x * x; }, "#3197FF");
        drawFunction(function (x) { return Math.cos(x); }, "#EA5356");
        drawFunction(function (x) { return Math.exp(x); }, "#FA5386");
        // Redibujar todas las funciones almacenadas
        functionsList.forEach(item => {
            drawFunction(item.func, item.color);
        });
        // Redibujar la serie más reciente si existe
        if (currentSeries !== null) {
            drawSeries(currentSeries.func, currentSeries.terms, currentSeries.color);
        }
    }

    window.onresize = function (event) {
        width = canvas.width;
        height = canvas.height;
        drawScreen();
    };

    canvas.onwheel = function (event) {
        unit -= event.deltaY / 10;  // Ajusta el nivel/velocidad de zoom

        // Limita el nivel de zoom mínimo
        if (unit < 8) {
            unit = 8;  // Este es el nivel de zoom mínimo. Puedes cambiar 8 por otro valor.
        }

        // Limita el nivel de zoom máximo
        if (unit > 1000) {
            unit = 1000;  // Este es el nivel de zoom máximo. Puedes cambiar 130 por otro valor.
        }

        drawScreen();  // Redibuja el canvas con el nuevo nivel de zoom
    };

    canvas.onmousedown = function (event) {
        drag = true;
        mouseX = event.clientX + offsetX;
        mouseY = event.clientY + offsetY;
    }

    canvas.onmousemove = function (event) {
        let currentMouseX = event.clientX;
        let currentMouseY = event.clientY;

        if (drag) {
            offsetX = mouseX - currentMouseX;
            offsetY = mouseY - currentMouseY;
            drawScreen();
        }
    }

    canvas.onmouseup = function (event) {
        drag = false;
    }

    // Adaptación de la función drawFunction para redibujar cada vez que se actualice el canvas
    function drawFunction(mathFunction, color) {
        let previousX = undefined;
        let previousY = undefined;

        for (let px = 0; px < width; px++) {
            const x = ((px + offsetX) / unit) - ((width / unit) / 2);
            const y = mathFunction(x);

            if (previousX !== undefined && previousY !== undefined) {
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(previousX, previousY);
                ctx.lineTo(origin.x - offsetX + unit * x, origin.y - offsetY - unit * y);
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            previousX = origin.x - offsetX + unit * x;
            previousY = origin.y - offsetY - unit * y;
        }
    }

    // Escuchar el botón de graficar
    document.getElementById("plot-button").addEventListener("click", function () {
        const input = document.getElementById("function-input").value;
        try {
            const mathFunction = new Function('x', `return ${input};`);
            // Agregar la función a la lista de funciones
            functionsList.push({ func: mathFunction, color: "#FF5733" });
            // Dibujar la nueva función
            drawScreen(); // Redibujar todo el canvas (ejes, grid, y todas las funciones)
        } catch (e) {
            alert("La función ingresada no es válida. Inténtalo de nuevo.");
        }
    });

    // Nueva función para graficar series
    function drawSeries(seriesTerm, terms, color) {
        let previousX = undefined;
        let previousY = undefined;

        // Para cada pixel en el canvas, calculamos el valor de la serie
        for (let px = 0; px < width; px++) {
            const x = ((px + offsetX) / unit) - ((width / unit) / 2);

            // Suma parcial de la serie
            let sum = 0;
            for (let n = 1; n <= terms; n++) {
                sum += seriesTerm(n, x);  // Calcular el término n-ésimo de la serie
            }

            const y = sum;  // El valor de la función es la suma parcial de los términos de la serie

            if (previousX !== undefined && previousY !== undefined) {
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(previousX, previousY);
                ctx.lineTo(origin.x - offsetX + unit * x, origin.y - offsetY - unit * y);
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            previousX = origin.x - offsetX + unit * x;
            previousY = origin.y - offsetY - unit * y;
        }
    }


    // Escuchar el botón de graficar series
    document.getElementById("plot-series-button").addEventListener("click", function () {
        const input = document.getElementById("series-input").value;
        const terms = parseInt(document.getElementById("terms-input").value);
        try {
            // Crear la función para los términos de la serie
            const seriesTerm = new Function('n', 'x', `return ${input};`);
            // Guardar la serie actual en una variable global
            currentSeries = {
                func: seriesTerm,
                terms: terms,
                color: "#33FF57"
            };

            // Redibujar solo la grilla, ejes y la nueva serie (sin guardar las anteriores)
            drawScreen(); // Redibujar el canvas (sin las funciones anteriores)
            drawSeries(seriesTerm, terms, "#33FF57");  // Graficar la nueva serie
        } catch (e) {
            alert("La serie ingresada no es válida. Inténtalo de nuevo.");
        }
    });
    // // Añadir un listener para graficar series
    // document.getElementById("plot-series-button").addEventListener("click", function () {
    //     const input = document.getElementById("series-input").value;
    //     const terms = parseInt(document.getElementById("terms-input").value);
    //     try {
    //         // Crear la función para los términos de la serie
    //         const seriesTerm = new Function('n', 'x', `return ${input};`);
    //         // Agregar la serie a la lista de funciones
    //         functionsList.push({
    //             func: function (x) {
    //                 let sum = 0;
    //                 for (let n = 1; n <= terms; n++) {
    //                     sum += seriesTerm(n, x);
    //                 }
    //                 return sum;
    //             },
    //             color: "#33FF57"
    //         });
    //         // Dibujar la nueva serie
    //         drawScreen(); // Redibujar todo el canvas con la nueva serie
    //     } catch (e) {
    //         alert("La serie ingresada no es válida. Inténtalo de nuevo.");
    //     }
    // });
};

// (2*Math.PI)*(((n / (Math.PI**2 * n**2 + 1)) - (n * (-1)**n / (Math.E * Math.PI**2 * n**2 + Math.E))) * Math.sin(n * Math.PI * x))
// -((2*Math.E**(-1)*Math.PI*n*((-1)**n-Math.E))/(Math.PI**2*n**2+1)) * Math.sin(n * Math.PI * x))
// (((Math.sin((6*Math.PI*n)/5)+Math.sin((2*Math.PI*n)/5))/(Math.PI*n)) * Math.cos ((2 * n * Math.PI * x)/5)) +  ((-((Math.cos((6*Math.PI*n)/5)+Math.cos((2*Math.PI*n)/5)-2)/(Math.PI*n))) * Math.sin ((2 * n * Math.PI * x)/5)) Requiere el coeficeinte a0 = -1/5

// (-(((40 * Math.pow(Math.PI, 2) * Math.pow(n, 2) - 288) * Math.pow(-1, n)) / (Math.pow(Math.PI, 3) * Math.pow(n, 3))))*Math.sin((n*Math.PI*x)/2)  Requiere el coeficeinte a0 = 3




// ngAfterViewInit(): void {
//  Object.asign(this, this.canvas.nativeElement);
