// HelloPoint1.js (c) 2012 matsuda

// ================================================================
// Global variables
// ================================================================

// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
    }`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }`;

// Globals
let canvas;
let gl;
let a_Position;
let a_PointSize;
let u_FragColor;
let g_penColor = [1.0, 1.0, 1.0, 1.0];
let g_points = []; // The array to store the positions of points
let g_colors = []; // The array to store the colors of a points

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

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

// ================================================================
// Initializers
// ================================================================

function setUpWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

    // Get the storage location of u_FragColor variable
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    // Check that all variables exist
    if (a_Position < 0 || a_PointSize < 0 || !u_FragColor) {
        if (a_Position < 0) console.log('Failed to get the storage location of a_Position');
        if (a_PointSize < 0) console.log('Failed to get the storage location of a_PointSize');
        if (!u_FragColor) console.log('Failed to get u_FragColor variable');
        return;
    }

    // Provide default values
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
    gl.vertexAttrib1f(a_PointSize, 10.0);
}

function addActionsForHTMLUI() {
    // Pen color sliders
    document.getElementById("penColor-r").addEventListener("mouseup", function() { g_penColor[0] = this.value/100; });
    document.getElementById("penColor-g").addEventListener("mouseup", function() { g_penColor[1] = this.value/100; });
    document.getElementById("penColor-b").addEventListener("mouseup", function() { g_penColor[2] = this.value/100; });
}

// ================================================================
// Event callback methods
// ================================================================

function click(ev) {
    // Extract the event click and convert to WebGL canvas space
    let [x, y] = coordinatesEventToGLSpace(ev);

    // Store the coordinates to g_points
    g_points.push([x, y]);
    // Store (a copy of) the current pen color to g_colors
    g_colors.push(g_penColor.slice());

    // Draw every shape that's supposed to be on the canvas.
    renderAllShapes();
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
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for(var i = 0; i < len; i++) {
        var xy = g_points[i];
        var rgba = g_colors[i];

        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Draw a point
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}