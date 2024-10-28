let bgColor = "#000222";   // Color de fondo
let fontColor = "#EBEBEB"; // Color de los números
let axisColor = "#90DCB5"; // Color de los ejes
let gridColor = "#6BBCAC"; // Color de la cuadrícula

let offsetX;  // Desplazamiento en el eje X
let offsetY;  // Desplazamiento en el eje Y
let dragging = false;  // Controla si estamos arrastrando el plano
let lastMouseX = 0;  // Guarda la última posición X del mouse
let lastMouseY = 0;  // Guarda la última posición Y del mouse
let scaleFactor = 1;  // Factor de escala para hacer zoom

function setup() {
    createCanvas(400, 400);

    // Inicializar el desplazamiento para que el origen esté en el centro de la pantalla
    offsetX = width / 2;
    offsetY = height / 2;

    textSize(10);
}

function draw() {
    background(bgColor); // Fondo del lienzo

    // Aplicar la escala para hacer zoom
    scale(scaleFactor);

    // Dibujar la cuadrícula
    stroke(gridColor);
    strokeWeight(0.5 / scaleFactor); // Ajustar el grosor de las líneas con el zoom
    for (let x = offsetX % (20 * scaleFactor); x <= width; x += 20 * scaleFactor) {
        line(x, 0, x, height / scaleFactor); // Líneas verticales
    }
    for (let y = offsetY % (20 * scaleFactor); y <= height; y += 20 * scaleFactor) {
        line(0, y, width / scaleFactor, y); // Líneas horizontales
    }

    // Dibujar los ejes con un color diferente y un grosor más fuerte
    stroke(axisColor);
    strokeWeight(2 / scaleFactor);
    line(offsetX, 0, offsetX, height / scaleFactor); // Eje Y
    line(0, offsetY, width / scaleFactor, offsetY);  // Eje X

    // Dibujar las marcas y etiquetas en el eje X
    fill(fontColor);
    for (let x = offsetX % (20 * scaleFactor); x <= width; x += 20 * scaleFactor) {
        let labelX = Math.round((x - offsetX) / (20 * scaleFactor));
        if (x != offsetX) {
            line(x, offsetY - 5 / scaleFactor, x, offsetY + 5 / scaleFactor); // Marcas
            text(labelX, x - 5 / scaleFactor, offsetY + 15 / scaleFactor); // Etiquetas
        }
    }

    // Dibujar las marcas y etiquetas en el eje Y
    for (let y = offsetY % (20 * scaleFactor); y <= height; y += 20 * scaleFactor) {
        let labelY = Math.round((offsetY - y) / (20 * scaleFactor));
        if (y != offsetY) {
            line(offsetX - 5 / scaleFactor, y, offsetX + 5 / scaleFactor, y); // Marcas
            text(labelY, offsetX + 10 / scaleFactor, y + 5 / scaleFactor); // Etiquetas
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
        offsetX += dx / scaleFactor;   // Ajustar el desplazamiento con respecto a la escala
        offsetY += dy / scaleFactor;
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

// Función para hacer zoom con el scroll del mouse
function mouseWheel(event) {
    let zoomSpeed = 0.05;
    if (event.delta > 0) {
        scaleFactor *= 1 - zoomSpeed;  // Alejar el zoom
    } else {
        scaleFactor *= 1 + zoomSpeed;  // Acercar el zoom
    }

    // Limitar el factor de escala para evitar zoom infinito
    scaleFactor = constrain(scaleFactor, 0.2, 5);  // Limitar entre 0.2x y 5x de zoom
}
