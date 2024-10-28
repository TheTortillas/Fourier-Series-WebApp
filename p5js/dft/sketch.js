// Coding Challenge 130.3: Drawing with Fourier Transform and Epicycles
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/130.1-fourier-transform-drawing.html
// https://thecodingtrain.com/CodingChallenges/130.2-fourier-transform-drawing.html
// https://thecodingtrain.com/CodingChallenges/130.3-fourier-transform-drawing.html
// https://youtu.be/7_vKzcgpfvU

const USER = 0;
const FOURIER = 1;

let x = [];
let fourierX;
let time = 0;
let path = [];
let drawing = [];
let state = -1;

let bgColor = "#222";   // Color de fondo
let fontColor = "#EBEBEB"; // Color de los números
let axisColor = "#90DCB5"; // Color de los ejes
let gridColor = "#6BBCAC"; // Color de la cuadrícula

function clearPath() {
    path = [];
    time = 0;
}

function mousePressed() {
    state = USER;
    drawing = [];
    x = [];
    clearPath();
}

function mouseReleased() {
    state = FOURIER;
    const skip = 1;
    for (let i = 0; i < drawing.length; i += skip) {
        x.push(new Complex(drawing[i].x, drawing[i].y));
    }
    fourierX = dft(x);

    fourierX.sort((a, b) => b.amp - a.amp);
    console.log(fourierX.length);
}

function setup() {
    // Crea el lienzo (canvas) y lo asigna al contenedor "planoContainer"
    let canvas = createCanvas(600, 600);
    canvas.parent('planoContainer'); // Asocia el canvas al div con id "planoContainer"
    background(0);
    fill(255);
    textAlign(CENTER);
    textSize(64);
    text("Draw Something!", width / 2, height / 2);
    frameRate(120);
}

function drawGrid() {
    background(bgColor); // Fondo del lienzo

    // Establecer el tamaño de texto más pequeño y estilo normal
    textSize(8);
    textStyle(NORMAL);
    noStroke();
    fill(fontColor);

    // Dibujar la cuadrícula
    stroke(gridColor);
    strokeWeight(0.5);
    for (let x = 0; x <= width; x += 20) {
        line(x, 0, x, height);
    }
    for (let y = 0; y <= height; y += 20) {
        line(0, y, width, y);
    }

    // Dibujar los ejes
    stroke(axisColor);
    strokeWeight(2);
    line(0, height / 2, width, height / 2); // Eje X
    line(width / 2, 0, width / 2, height); // Eje Y

    // Dibujar las marcas y etiquetas en el eje X
    noStroke();
    for (let x = 0; x <= width; x += 20) {
        stroke(axisColor);
        line(x, height / 2 - 5, x, height / 2 + 5);
        noStroke();
        if (x != width / 2) {
            fill(fontColor);
            text((x - width / 2) / 20, x - 5, height / 2 + 15);
        }
    }

    // Dibujar las marcas y etiquetas en el eje Y
    noStroke();
    for (let y = 0; y <= height; y += 20) {
        stroke(axisColor);
        line(width / 2 - 5, y, width / 2 + 5, y);
        noStroke();
        if (y != height / 2) {
            fill(fontColor);
            text((height / 2 - y) / 20, width / 2 + 10, y + 5);
        }
    }
}

function epicycles(x, y, rotation, fourier) {
    for (let i = 0; i < fourier.length; i++) {
        let prevx = x;
        let prevy = y;
        let freq = fourier[i].freq;
        let radius = fourier[i].amp;
        let phase = fourier[i].phase;
        x += radius * cos(freq * time + phase + rotation);
        y += radius * sin(freq * time + phase + rotation);

        stroke(255, 100);
        noFill();
        ellipse(prevx, prevy, radius * 2);
        stroke(255);
        line(prevx, prevy, x, y);
    }
    return createVector(x, y);
}

function draw() {
    // Dibuja el grid en cada frame
    drawGrid();

    if (state == USER) {
        let point = createVector(mouseX - width / 2, mouseY - height / 2);
        drawing.push(point);
        stroke("#EA5356");
        noFill();
        beginShape();
        for (let v of drawing) {
            vertex(v.x + width / 2, v.y + height / 2);
        }
        endShape();
    } else if (state == FOURIER) {
        let v = epicycles(width / 2, height / 2, 0, fourierX);
        path.unshift(v);
        beginShape();
        noFill();
        strokeWeight(2);
        stroke(255, 0, 255);
        for (let i = 0; i < path.length; i++) {
            vertex(path[i].x, path[i].y);
        }
        endShape();

        const dt = TWO_PI / fourierX.length;
        time += dt;

        if (time > TWO_PI) {
            clearPath();
        }
    }
}
