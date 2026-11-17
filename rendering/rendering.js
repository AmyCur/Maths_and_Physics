import { initBuffers, initBuffersPrimative } from "./init-buffers.js";
import * as draw from "./draw-scene.js";
import { input } from "../input/input.js";
import { initShaderProgram } from "./shaders.js";
import { cube, floor } from "./Primative.js";


let cubeRotation = 0.0;
let deltaTime = 0;

export function InitRendering() {

    const canvas = document.getElementById("gl-canvas");

    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (gl === null) {
        console.warn(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established.
    const shaderProgram = initShaderProgram(gl);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            position: gl.getUniformLocation(shaderProgram, "position"),
            scale: gl.getUniformLocation(shaderProgram, "scale"),
        },
    };

    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    

    const cb = initBuffersPrimative(gl, cube);
    const fb = initBuffersPrimative(gl, floor);

    // // Draw the scene
    // let then = 0;

    // const speed = 2;
    // const gravityRate = 0.5;

    // function Gravity() {
    //     if (playerPos.y < 0) {
    //         playerPos.y += gravityRate;
    //         if (playerPos.y > 0) playerPos.y = 0
    //     }

    // }
    // let jumped = false;

    // function Jump() {
    //     jumped = true;
    //     setTimeout(() => { jumped = false }, 1000);


    // }

    // input.AddListeners();

    return {
        gl: gl,
        programInfo: programInfo,
        buffers: [cb, fb]
    }
}





export function Render(gl, programInfo, buffers) {
    draw.drawScene(gl, programInfo, buffers);
}


//
// Initialize a shader program, so WebGL knows how to draw our data
//

