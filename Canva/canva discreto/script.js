window.onload = function () {
    const canvas = document.getElementById("canvas");
    //@type {CanvasRenderingContext2D} 
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let unit = Math.max(25, Math.min(25, Math.floor(width / (500)))); // Changes when zoom

    let offsetX = 0;
    let offsetY = 0;

    ctx.font = "14px CMU Serif";
    bgColor = "#222";
    fontColor = "#EBEBEB";
    axisColor = "#90DCB5";
    gridColor = "#6BBCAC";

    let drawing = false; // Para indicar si el usuario está dibujando
    let drawnPoints = []; // Almacena los puntos de la función dibujada

    // Mapa para almacenar valores únicos de X (clave: x, valor: {x, y})
    let pointsMap = new Map();

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

        const origin = {
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

        // Dibujar la función "a mano" desde los puntos almacenados en el mapa
        if (pointsMap.size > 0) {
            ctx.beginPath();
            ctx.strokeStyle = "#FF5733"; // Color para la función dibujada
            ctx.lineWidth = 2;
            let first = true;
            pointsMap.forEach((point) => {
                if (first) {
                    ctx.moveTo(point.x, point.y);
                    first = false;
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.stroke();
        }
    }

    // Escuchar eventos de mouse para dibujar
    canvas.onmousedown = function (event) {
        drawing = true;
        addPoint(event);
    };

    canvas.onmousemove = function (event) {
        if (drawing) {
            addPoint(event);
            drawScreen(); // Redibujar cada vez que el mouse se mueve
        }
    };

    canvas.onmouseup = function () {
        drawing = false;
        discretizeFunction();
    };

    function addPoint(event) {
        const rect = canvas.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        // Convertir coordenadas de canvas a coordenadas matemáticas
        const x = Math.round((canvasX - width / 2 + offsetX) / unit); // Redondear X a un entero
        const y = -(canvasY - height / 2 - offsetY) / unit;

        // Si ya existe un punto con este valor de X, actualizar su Y
        if (pointsMap.has(x)) {
            pointsMap.set(x, { x: canvasX, y: canvasY });
        } else {
            pointsMap.set(x, { x: canvasX, y: canvasY });
        }
    }

    function discretizeFunction() {
        const discretizedPoints = [];
        pointsMap.forEach((point, x) => {
            // Convertir de coordenadas de canvas a coordenadas matemáticas
            const mathX = x;
            const mathY = -(point.y - height / 2 - offsetY) / unit;
            discretizedPoints.push({ x: mathX, y: mathY });
        });

        console.log("Puntos discretizados:", discretizedPoints);
        // Aquí podrías hacer lo que quieras con los puntos discretizados
    }

    window.onresize = function () {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        drawScreen();
    };

    drawScreen();
};
