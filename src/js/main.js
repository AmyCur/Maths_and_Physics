// Main function

// const canvas = document.getElementById("canvas");
// const gl = canvas.getContext("webgl2");

// Define triangle vertices
const vertices = new Float32Array([
    // x    y    z
    -0.5, -0.5, 0.0, // vertex 0    2 --- 3
    0.5, -0.5, 0.0, // vertex 1     |     |
    -0.5,  0.5, 0.0, // vertex 2    0 --- 1
    0.5, 0.5,  0.0,
    0.0, 1.0, 0.0,
    1, 0.8,0,
    -1, 0.8, 0,
  ]);



  // Define fragment shader
  const fragmentShaderSource = 
    `#version 300 es
    precision mediump float;

    uniform vec4 uColor;
    out vec4 fragColor;

    void main() {
        fragColor = uColor;
    }`;

const vertexShaderSource = 
    `#version 300 es
    precision mediump float;

    in vec3 aPosition;

    void main() {
        gl_Position = vec4(aPosition, 1);
    }`;

function BindVBOAndCopyVerticiesData(gl){
    // Create a VBO for the triangle
    const vbo = gl.createBuffer();
    // Bind it
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    // gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); – Copies the data from the vertices array into the VBO which is the currently bound buffer. The gl.STATIC_DRAW input is a performance hint to WebGL, here we are saying that that triangle vertices will not change.
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // Un bind it
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return vbo;
}

// function CreateVertexShader(){

    

//     const vertexShader = gl.createShader(gl.VERTEX_SHADER);
//     gl.shaderSource(vertexShader, vertexShaderSource);
//     gl.compileShader(vertexShader);

//     if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
//         console.log(`Error compiling vertex shader:\n`, gl.getShaderInfoLog(vertexShader));
//         gl.deleteShader(vertexShader);
//     }

//     return vertexShader;
// }

// function CreateFragmentShader(){
//     // Define fragment shader
    

//     const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
//     gl.shaderSource(fragmentShader, fragmentShaderSource);
//     gl.compileShader(fragmentShader);

//     if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
//         console.log(`Error compiling fragment shader:\n`, gl.getShaderInfoLog(fragmentShader));
//         gl.deleteShader(fragmentShader);
//     }   

//     return fragmentShader;
// }

// function CreateProgram(vertexShader, fragmentShader){
//     const program = gl.createProgram();
//     gl.attachShader(program, vertexShader);
//     gl.attachShader(program, fragmentShader);
//     gl.linkProgram(program);

//     if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//         console.log(`Failed to link WebGL program : ${gl.getProgramInfoLog(program)}`);
//         return;
//     }

//     gl.useProgram(program);

//     return program;
// }

function CommunicateVertexAttrib(gl, program, vbo){
    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.vertexAttribPointer
    (
        positionLocation, // index
        3,                // size
        gl.FLOAT,         // type
        false,            // normalized
        0,                // stride
        0                 // offset
    );   
}

function DrawTriangle(gl){
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 7);
}

function main() {
    const canvas = document.getElementById("canvas");
    const gl = initWebGL(canvas);

    const vbo = BindVBOAndCopyVerticiesData(gl);
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    gl.useProgram(program);

    CommunicateVertexAttrib(gl, program, vbo);

    const colorLocation = gl.getUniformLocation(program, 'uColor');
    gl.uniform4fv(colorLocation, [0.5, 1.0, 1, 1.0]);

    DrawTriangle(gl);
}

main();