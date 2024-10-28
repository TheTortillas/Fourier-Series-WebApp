let bgColor = "#222";   // Color de fondo
let fontColor = "#EBEBEB"; // Color de los números
let axisColor = "#90DCB5"; // Color de los ejes
let gridColor = "#6BBCAC"; // Color de la cuadrícula

function setup() {
    // Crea el lienzo (canvas) y lo asigna al contenedor "planoContainer"
    let canvas = createCanvas(600, 600);
    canvas.parent('planoContainer'); // Asocia el canvas al div con id "planoContainer"

    background(bgColor); // Fondo del lienzo

    // Establecer el tamaño de texto más pequeño y estilo normal
    textSize(8); // Reducir aún más el tamaño de la fuente
    textStyle(NORMAL); // Evitar estilos como negritas
    noStroke(); // Evitar cualquier contorno en el texto
    fill(fontColor); // Establece el color del texto

    // Dibujar la cuadrícula con líneas opacas
    stroke(107, 188, 172, 100); // Color de la cuadrícula en RGB con valor alfa de 100 para mayor opacidad
    strokeWeight(0.5); // Grosor de las líneas de la cuadrícula más delgado
    for (let x = 0; x <= width; x += 20) {
        line(x, 0, x, height); // Líneas verticales
    }
    for (let y = 0; y <= height; y += 20) {
        line(0, y, width, y); // Líneas horizontales
    }

    // Dibujar los ejes con un color diferente y un grosor más fuerte
    stroke(axisColor); // Color para los ejes
    strokeWeight(2); // Grosor más fuerte para los ejes
    line(0, height / 2, width, height / 2); // Línea horizontal (eje X)
    line(width / 2, 0, width / 2, height); // Línea vertical (eje Y)

    // Dibujar las marcas y etiquetas en el eje X
    noStroke(); // Asegurarse de que el texto no tenga contorno
    for (let x = 0; x <= width; x += 20) {
        stroke(axisColor); // Volver a aplicar el color para las marcas
        line(x, height / 2 - 5, x, height / 2 + 5); // Dibujar las marcas
        noStroke(); // Desactivar el contorno de nuevo para el texto
        // Dibujar etiquetas con el color de fuente
        if (x != width / 2) {
            fill(fontColor); // Aplicar color al texto
            text((x - width / 2) / 20, x - 5, height / 2 + 15);
        }
    }

    // Dibujar las marcas y etiquetas en el eje Y
    noStroke(); // Asegurarse de que el texto no tenga contorno
    for (let y = 0; y <= height; y += 20) {
        stroke(axisColor); // Volver a aplicar el color para las marcas
        line(width / 2 - 5, y, width / 2 + 5, y); // Dibujar las marcas
        noStroke(); // Desactivar el contorno de nuevo para el texto
        // Dibujar etiquetas con el color de fuente
        if (y != height / 2) {
            fill(fontColor); // Aplicar color al texto
            text((height / 2 - y) / 20, width / 2 + 10, y + 5);
        }
    }
}

function draw() {
    // No es necesario agregar nada en draw ya que el plano es estático
}
