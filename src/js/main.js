import { drawScene } from "./drawing.js";
import { initShaders } from "./shaders.js";
import { CreateVBO } from "./buffers.js";

function GetGL(){
    const canvas=document.getElementById("gl-canvas");
    const gl=canvas.getContext("webgl");
    if(!gl) console.log("GL is unsupported");
    return gl;
}

function main(){
    const gl = GetGL();
    const vbo = CreateVBO(gl);
    const program = initShaders(gl);
    // const buffers = initBuffers();
    drawScene(gl, vbo, program);
}

main();