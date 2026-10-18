function ClearScene(gl, canvas){
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(
        0.2,
        0.2,
        0.3,
        1.0
    );

    gl.clear(gl.COLOR_BUFFER_BIT);
}

// Define triangle vertices
const vertices = new Float32Array([
  // x    y    z
  -0.5, -0.5, 0.0, // vertex 0       2
   0.5, -0.5, 0.0, // vertex 1     /   \
   0.0,  0.5, 0.0, // vertex 2    0 --- 1
]);

function drawScene(gl, canvas, vbo, program){
    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.vertexAttribPointer(
        positionLocation, // index
        3,                // size
        gl.FLOAT,         // type
        false,            // normalized
        0,                // stride
        0
    );        

    ClearScene(gl, canvas);
}

export {drawScene, vertices}