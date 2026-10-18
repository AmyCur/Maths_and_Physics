import { drawScene } from "./drawing.js";
import { initShaders } from "./shaders.js";
import { CreateVBO } from "./buffers.js";

function GetGL(){
    const canvas=document.getElementById("gl-canvas");
    const gl=canvas.getContext("webgl");
    if(!gl) console.log("GL is unsupported");
    return {gl: gl, canvas: canvas};
}

function main(){
    const gl = GetGL().gl;
    const canvas = GetGL().canvas;
    const vbo = CreateVBO(gl);
    const program = initShaders(gl);
    // const buffers = initBuffers();
    drawScene(gl, canvas, vbo, program);
}

main();