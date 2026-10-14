  // Define fragment shader
const fragmentShaderSource = 
    `#version 300 es
    precision mediump float;

    uniform vec4 uColor;
    uniform float z;
    out vec4 fragColor;
    vec4 black = vec4(0,0,0,1);

    void main() {
        fragColor = uColor+vec4(black.x*z,black.y*z,black.z*z,z*0.001);
    }`;

const vertexShaderSource = 
    `#version 300 es
    precision mediump float;

    in vec3 aPosition;

    void main() {
        gl_Position = vec4(aPosition, 1);
    }`;

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

function createShapeBuffer(gl, data){
    const buffer = gl.createBuffer();
    // Bind it
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); – Copies the data from the vertices array into the VBO which is the currently bound buffer. The gl.STATIC_DRAW input is a performance hint to WebGL, here we are saying that that triangle vertices will not change.
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
}

function DrawTriangle(gl, max){
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, max);
}

function setupDrawState(gl, buffer, color, positionLocation, colorLocation) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    // Tell WebGL how to read data from the vertex buffer
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    //send color data to fragment shader
    gl.uniform4fv(colorLocation, color);
}

function MainRender(){
    const canvas = document.getElementById("canvas");
    const gl = initWebGL(canvas);

    const houseBuffer = createShapeBuffer(gl, houseData);    
    const doorBuffer = createShapeBuffer(gl, doorData);
    const grassBuffer = createShapeBuffer(gl, grassData);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // const vbo = BindVBOAndCopyVerticiesData(gl);
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    gl.useProgram(program);

    // CommunicateVertexAttrib(gl, program, vbo);

    const colorLocation = gl.getUniformLocation(program, 'uColor');
    const positionLocation = gl.getAttribLocation(program, "aPosition");
    setupDrawState(gl, houseBuffer, [1.0, 1.0, 0.0, 1.0], positionLocation, colorLocation);
    DrawTriangle(gl, 5);
    setupDrawState(gl, doorBuffer, [0.0, 0.0, 1.0, 1.0], positionLocation, colorLocation);
    DrawTriangle(gl,4)
    setupDrawState(gl, grassBuffer, [0.0, 1.0, 0.0, 1.0], positionLocation, colorLocation);
    DrawTriangle(gl,4)
}