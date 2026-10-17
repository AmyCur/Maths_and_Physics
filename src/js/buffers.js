// Define triangle vertices
const vertices = new Float32Array([
  // x    y    z
  -0.5, -0.5, 0.0, // vertex 0       2
   0.5, -0.5, 0.0, // vertex 1     /   \
   0.0,  0.5, 0.0, // vertex 2    0 --- 1
]);

function CreateVBO(gl){
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
}

export {CreateVBO};