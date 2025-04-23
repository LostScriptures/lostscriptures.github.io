var gl = null;
var viewportWidth = 0;
var viewportHeight = 0;
let startTime;

function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
}

function loadFile(fileName) {
    return fetch(fileName)
        .then((res) => res.text())
};

function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl");
        if (!gl)
            gl = canvas.getContext("experimental-webgl");
        if (gl) {
            viewportWidth = canvas.width;
            viewportHeight = canvas.height;
        }
    } catch (e) {
    }

    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function getShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile failed:", gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

var program;

async function initShaders() {
    const [vsSource, fsSource] = await Promise.all([
        loadFile("vert.vs"),
        loadFile("frag.fs")
    ]);

    var vertexShader = getShader(gl, gl.VERTEX_SHADER, vsSource);
    var fragmentShader = getShader(gl, gl.FRAGMENT_SHADER, fsSource);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(program);

    program.positionAttr = gl.getAttribLocation(program, "positionAttr");
    gl.enableVertexAttribArray(program.positionAttr);

    program.uTime = gl.getUniformLocation(program, "uTime");


    //program.colorAttr = gl.getAttribLocation(program, "colorAttr");
    //gl.enableVertexAttribArray(program.colorAttr);
}

var buffer;

function initGeometry() {
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Interleave vertex positions and colors
    var vertexData = [
        //X    Y     Z       R     G     B     A  (A)
        0.0,  0.0,  0.0,    //1.0,  0.0,  0.0,  1.0,
        //X    Y     Z       R     G     B     A  (B)
        1.0,  -0.45, 0.0,   //0.0,  1.0,  0.0,  1.0,
        //X    Y     Z       R     G     B     A  (C)
        0.45, -1.0,  0.0,    //0.0,  0.0,  1.0,  1.0,
        //X    Y     Z       R     G     B     A  (D)
        -0.45, -1.0, 0.0,   //1.0,  0.0,  0.0,  1.0,
        //X    Y     Z       R     G     B     A  (E)
        -1.0, -0.45, 0.0,   //0.0,  1.0,  0.0,  1.0,
        //X    Y     Z       R     G     B     A  (F)
        -1.0, 0.45,  0.0,    //0.0,  0.0,  1.0,  1.0,
        //X    Y     Z       R     G     B     A  (G)
        -0.45, 1.0,  0.0,    //1.0,  0.0,  0.0,  1.0,
        //X    Y     Z       R     G     B     A  (H)
        0.45,  1.0,  0.0,    //0.0,  1.0,  0.0,  1.0,
        //X    Y     Z       R     G     B     A  (I)
        1.0,  0.45,  0.0,    //0.0,  0.0,  1.0,  1.0,
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    var indices = [
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
        0, 4, 5,
        0, 5, 6,
        0, 6, 7,
        0, 7, 8,
        0, 8, 1
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
}

function drawScene() {
    gl.viewport(0, 0, viewportWidth, viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // There are 7 floating-point values per vertex
    var stride = 3 * Float32Array.BYTES_PER_ELEMENT;

    // Set up position stream
    gl.vertexAttribPointer(program.positionAttr, 3, gl.FLOAT, false, stride, 0);
    // Set up color stream
    //gl.vertexAttribPointer(program.colorAttr, 4, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);

    gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 0);
}

async function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    await initShaders();
    initGeometry();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.disable(gl.DEPTH_TEST);
    
    drawScene();

    startTime = performance.now();
    renderLoop();
}


function renderLoop() {
    const currentTime = performance.now();
    const elapsed = (currentTime - startTime) / 1000; // in seconds

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set the uniform before drawing
    gl.uniform1f(program.uTime, elapsed);

    drawScene(); // your existing draw call

    requestAnimationFrame(renderLoop);
}

