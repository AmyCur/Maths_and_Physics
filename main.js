import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

main();

//
// start here
//


function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
            `Unable to initialize the shader program: ${gl.getProgramInfoLog(
                shaderProgram,
            )}`,
        );
        return null;
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(
            `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
        );
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function RenderScreen(gl, program) {
    ClearScreen(gl, canvas);
    gl.useProgram(program);
    gl.depthFunc(gl.LEQUAL);

    const sunSegments = 32;

    const houseBuffer = createShapeBuffer(gl, houseData);
    const doorBuffer = createShapeBuffer(gl, doorData);
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

let doorColor = [0,0,1,1];

function Loop() {

}

let program;
const gl = GetGL(canvas);

function start() {
    const canvas = document.getElementById("canvas");
    program = CompileShaders(gl);
    requestAnimationFrame(main);
}

let deltaTime = 0;
let then = 0;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let tick=0;

// Main function
function main(now) {
    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    then = now;
    tick++;
    requestAnimationFrame(main);
    if(tick%20==0) doorColor = [Math.random(),Math.random(),Math.random(),1]
    if(tick%4==0)
    for(let i =0; i < houseData.length; i++){
        houseData[i]=Math.random()*1;
    }
    for(let i = 0; i < roofLineData.length; i++){
        roofLineData[i]+=Math.random()/1000;
    }
    RenderScreen(gl, program);
}

start();