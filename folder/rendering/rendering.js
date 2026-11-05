import { InitShaders } from "./shaders.js";
import { ClearScreen, DrawScreen } from "./draw-screen.js";

function InitWebGL() {
    const canvas = document.getElementById("canvas");

    // @ts-ignore
    const gl = canvas.getContext("webgl2");
    return gl;
}

function render() {
    const gl = InitWebGL();
    ClearScreen(gl);

    const shaderProgram = InitShaders(gl);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        },
    };

    DrawScreen(gl);



}

export { render };

