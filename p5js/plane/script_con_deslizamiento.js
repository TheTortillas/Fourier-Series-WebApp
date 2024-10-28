let bgColor = "#222";   // Color de fondo
let fontColor = "#EBEBEB"; // Color de los números
let axisColor = "#90DCB5"; // Color de los ejes
let gridColor = "#6BBCAC"; // Color de la cuadrícula

let offsetX;  // Desplazamiento en el eje X
let offsetY;  // Desplazamiento en el eje Y
let dragging = false;  // Controla si estamos arrastrando el plano
let lastMouseX = 0;  // Guarda la última posición X del mouse
let lastMouseY = 0;  // Guarda la última posición Y del mouse


function setup() {
    createCanvas(400, 400);

    // Inicializar el desplazamiento para que el origen esté en el centro de la pantalla
    offsetX = width / 2;
    offsetY = height / 2;

    textSize(10);
}

function draw() {
    background(bgColor); // Fondo del lienzo

    // Dibujar la cuadrícula
    stroke(gridColor);
    strokeWeight(0.5); // Grosor de las líneas de la cuadrícula más delgado
    for (let x = offsetX % 20; x <= width; x += 20) {
        line(x, 0, x, height); // Líneas verticales
    }
    for (let y = offsetY % 20; y <= height; y += 20) {
        line(0, y, width, y); // Líneas horizontales
    }

    // Dibujar los ejes con un color diferente y un grosor más fuerte
    stroke(axisColor);
    strokeWeight(2);
    line(offsetX, 0, offsetX, height); // Eje Y
    line(0, offsetY, width, offsetY);  // Eje X

    // Dibujar las marcas y etiquetas en el eje X
    fill(fontColor);
    for (let x = offsetX % 20; x <= width; x += 20) {
        let labelX = Math.round((x - offsetX) / 20);
        if (x != offsetX) {
            line(x, offsetY - 5, x, offsetY + 5); // Marcas
            text(labelX, x - 5, offsetY + 15); // Etiquetas
        }
    }

    // Dibujar las marcas y etiquetas en el eje Y
    for (let y = offsetY % 20; y <= height; y += 20) {
        let labelY = Math.round((offsetY - y) / 20);
        if (y != offsetY) {
            line(offsetX - 5, y, offsetX + 5, y); // Marcas
            text(labelY, offsetX + 10, y + 5); // Etiquetas
        }
    }
}

// Cuando se presiona el mouse, empieza a arrastrar
function mousePressed() {
    dragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
}

// Cuando se suelta el mouse, deja de arrastrar
function mouseReleased() {
    dragging = false;
}

// Mientras se arrastra el mouse, mueve el plano
function mouseDragged() {
    if (dragging) {
        let dx = mouseX - lastMouseX;  // Diferencia en X
        let dy = mouseY - lastMouseY;  // Diferencia en Y
        offsetX += dx;
        offsetY += dy;
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}
