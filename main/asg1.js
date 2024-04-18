// HelloPoint1.js (c) 2012 matsuda

// ================================================================
// Global variables
// ================================================================

// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = u_Size;
    }`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }`;

// Globals
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const SIZE_DELTA = 1/200.0; // Used to scale shapes like triangles and circles.

let canvas;
let gl;
let a_Position;
let u_Size;
let u_FragColor;

let g_penColor = [1.0, 1.0, 1.0, 1.0];
let g_penSize = 10.0;
let g_circleSegments = 10;
let g_penType = POINT;
let g_shapesList = [];

// ================================================================
// Main
// ================================================================

function main() {
    
    // Set up canvas and gl variables
    setUpWebGL();
    // Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    // Set up actions for the HTML UI elements
    addActionsForHTMLUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    // If the mouse is down, draw.
    canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev); } };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    clearCanvas();

    renderBird();
}

// ================================================================
// Initializers
// ================================================================

function setUpWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById("webgl");

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", {
        preserveDrawingBuffer: true
    });

    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get storage locations
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');

    // Check that all variables exist
    if (a_Position < 0 || !u_Size || !u_FragColor) {
        if (a_Position < 0) console.log("Failed to get the storage location of a_Position");
        if (!u_FragColor) console.log("Failed to get u_FragColor variable");
        if (!u_Size) console.log("Failed to get u_Size variable");
        return;
    }

    // Provide default values
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
}

function addActionsForHTMLUI() {
    // Clear canvas button
    document.getElementById("clearCanvas").addEventListener("mouseup", function() { 
        g_shapesList = []; 
        renderAllShapes();
    });

    // Clear canvas button
    document.getElementById("drawBird").addEventListener("mouseup", function() { 
        g_shapesList = []; 
        renderBird();
    });

    // Initialize dynamic text
    g_penType = POINT;
    sendTextTOHTML("penType", "Pen Type (selected: POINT)");
    sendTextTOHTML("circleLabel", `Circle Segments (current: ${g_circleSegments})`); 

    document.getElementById("penPoint").addEventListener("mouseup", function() { 
        g_penType = POINT;
        sendTextTOHTML("penType", "Pen Type (selected: POINT)");
    });
    document.getElementById("penTriangle").addEventListener("mouseup", function() { 
        g_penType = TRIANGLE;
        sendTextTOHTML("penType", "Pen Type (selected: TRIANGLE)");
    });
    document.getElementById("penCircle").addEventListener("mouseup", function() { 
        g_penType = CIRCLE;
        sendTextTOHTML("penType", "Pen Type (selected: CIRCLE)");
    });
    
    // Circle segment count slider
    let circleCount = document.getElementById("circleCount")
    circleCount.addEventListener("mouseup", function() { 
        g_circleSegments = this.value;
    });
    circleCount.addEventListener("mousemove", function() {
        sendTextTOHTML("circleLabel", `Circle Segments (current: ${this.value})`); 
    });

    // Pen color sliders
    document.getElementById("penColor-r").addEventListener("mouseup", function() { g_penColor[0] = this.value/255; });
    document.getElementById("penColor-g").addEventListener("mouseup", function() { g_penColor[1] = this.value/255; });
    document.getElementById("penColor-b").addEventListener("mouseup", function() { g_penColor[2] = this.value/255; });

    // Pen size slider
    document.getElementById("penSize").addEventListener("mouseup", function() { g_penSize = this.value; });
}

function clearCanvas() {
    gl.clear(gl.COLOR_BUFFER_BIT);
}

// ================================================================
// Event callback methods
// ================================================================

function click(ev) {
    // Extract the event click and convert to WebGL canvas space
    let [x, y] = coordinatesEventToGLSpace(ev);

    let shape = undefined;
    switch (g_penType) {
        case POINT:
            shape = new Point();
            break;
        case TRIANGLE:
            shape = new Triangle();
            break;
        case CIRCLE:
            shape = new Circle();
            shape.setSegments(g_circleSegments);
            break;
    }
    
    if (shape != undefined) {
        shape.setPosition(x, y, 0.0);
        shape.setColor(...g_penColor);
        shape.setSize(g_penSize);

        g_shapesList.push(shape);

        // Draw every shape that's supposed to be on the canvas.
        renderAllShapes();
    }
}

// ================================================================
// Render methods
// ================================================================

function coordinatesEventToGLSpace(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    // Transform from client space to WebGL canvas space
    x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
    y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);

    return [x, y];
}

function renderAllShapes() {

    // Store the time at the start of this function.
    let startTime = performance.now();

    // Clear <canvas>
    clearCanvas();

    var len = g_shapesList.length;
    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }

    updatePerformanceDebug(len, startTime, performance.now());
}

function renderBird() {

    // Store the time at the start of this function.
    let startTime = performance.now();

    // Clear <canvas>
    clearCanvas();

    Bird.render();

    updatePerformanceDebug(birdPoints.length, startTime, performance.now());
}

// ================================================================
// Utility methods
// ================================================================

function updatePerformanceDebug(shapes, start, end) {
    let duration = end-start;
    sendTextTOHTML("performance",
                        `# shapes: ${shapes} | ms: ${Math.floor(duration)} | fps: ${Math.floor(10000/duration)/10}`)
}

function sendTextTOHTML(htmlID, text) {
    let htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log(`Failed to get ${htmlID} from HTML.`);
        return;
    }
    htmlElm.innerHTML = text;
}