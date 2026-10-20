const houseData = new Float32Array([
    // x    y    z                    4
    -0.5, -0.5, 0.0, // vertex 0     /\
    0.5, -0.5, 0.0, // vertex 1     /  \
    -0.5, 0.5, 0.0, // vertex 2   2 ---3
    0.5, 0.5, 0.0, // vertex 3    |    |
    0.0, 1.0, 0.0 // vertex 4     0 ---1
]);


let doorData = new GameObject(
    new Float32Array([
        0.0, -0.5, -0.1,
        0.3, -0.5, -0.1,
        0.0, -0.1, -0.1,
        0.3, -0.1, -0.1
    ]),
    { x: 0, y: .1, z: 0 }
);

// Define window (Z = -0.1, in front of house)
const windowData = new Float32Array([
    -0.4, 0.4, -0.1,
    -0.1, 0.4, -0.1,
    -0.4, 0.2, -0.1,
    -0.1, 0.2, -0.1
]);

const grassData = new Float32Array([
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
]);

const roofLineData = new Float32Array([
    -0.5, 0.5, -0.1,
    0.5, 0.5, -0.1
]);

function createShapeBuffer(gl, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
}

function unbindBuffer(gl) {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}


function GetGL(canvas) {
    const gl = canvas.getContext("webgl2");
    if (!gl) throw new Error("WebGL not supported");
    return gl;
}

function ClearScreen(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function setupDrawState(gl, buffer, colour, positionLocation, colourLocation) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    // Tell WebGL how to read data from the vertex buffer
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    //send colour data to fragment shader
    gl.uniform4fv(colourLocation, colour);
}

function GenerateCircle(segments, size) {
    // Define Sun
    const cx = -0.75; // Offset X
    const cy = 0.7; // Offset Y

    // Apply offset to centre vertex
    const sunArray = [cx, cy, 0.0];

    for (let i = 0; i <= segments; i++) {
        const angleCircle = (i * 2 * Math.PI) / segments;
        sunArray.push(
            cx + (size.x * Math.cos(angleCircle)), // Apply offset to perimeter X
            cy + (size.y * Math.sin(angleCircle)), // Apply offset to perimeter Y
            0.0
        );
    }

    return new Float32Array(sunArray);
}


function RenderScreen(gl, program) {
    ClearScreen(gl, canvas);
    gl.useProgram(program);
    gl.depthFunc(gl.LEQUAL);

    const sunSegments = 32;

    const houseBuffer = createShapeBuffer(gl, houseData);
    const doorBuffer = createShapeBuffer(gl, doorData.data);
    const windowBuffer = createShapeBuffer(gl, windowData);
    const grassBuffer = createShapeBuffer(gl, grassData);
    const roofLineBuffer = createShapeBuffer(gl, roofLineData);
    const sunBuffer = createShapeBuffer(gl, GenerateCircle(sunSegments, { x: 0.2, y: 0.2 }));

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    const colourLocation = gl.getUniformLocation(program, 'uColour');
    // setupDrawState(gl, houseBuffer, [1.0, 1.0, 0.0, 1.0], positionLocation, colourLocation);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    //Draw door
    setupDrawState(gl, doorBuffer, doorColor, positionLocation, colourLocation);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    //Draw window
    setupDrawState(gl, windowBuffer, [1.0, 0.0, 0.5, 1.0], positionLocation, colourLocation);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    //Draw grass
    setupDrawState(gl, grassBuffer, [0.0, 1.0, 0.0, 1.0], positionLocation, colourLocation);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    //Draw house
    setupDrawState(gl, houseBuffer, [1.0, 1.0, 0.0, 1.0], positionLocation, colourLocation);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);

    setupDrawState(gl, roofLineBuffer, [0.6, 0.4, 0.3, 1.0], positionLocation, colourLocation);
    gl.drawArrays(gl.LINES, 0, 2);

    setupDrawState(gl, sunBuffer, [1.0, 0.5, 0.0, 1.0], positionLocation, colourLocation);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, sunSegments + 2);
}

let doorColor = [0, 0, 1, 1];

function Loop() {

}

let program;
const gl = GetGL(canvas);

function start() {
    const canvas = document.getElementById("canvas");
    program = CompileShaders(gl);
    requestAnimationFrame(main);
    setInterval(GetTPS, 1000);
}

let deltaTime = 0;
let then = 0;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let tick = 0;
let pt = 0;

function GetTPS() {
    console.log(tick - pt);
    pt = tick;
}



// Main function
function main(now) {
    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    then = now;
    console.log(doorData.position);
    // if(tick%1==0) doorData.AddPos(.01,.01,0);
    doorData.SetScale(1,1,1)
    tick++;
    RenderScreen(gl, program);
    requestAnimationFrame(main);
}

start();