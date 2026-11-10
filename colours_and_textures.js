// Define vertex shader
const vertexShaderSource =
  `#version 300 es
precision mediump float;

in vec3 aPosition;
in vec3 aColour;
in vec2 aTexCoord;
out vec3 vColour;
out vec2 vTexCoord;

void main() {
  gl_Position = vec4(aPosition, 1.0);
  vColour = aColour;
  vTexCoord=aTexCoord;
}`;

// Define fragment shader
const fragmentShaderSource =
  `#version 300 es
    precision mediump float;
    
    in vec3 vColour;
    out vec4 fragColour;
    in vec2 vTexCoord;
    uniform sampler2D uTexture;
    void main() {
        fragColour = texture(uTexture, vTexCoord);
    }
`;


/** @type {WebGL2RenderingContext} */
const gl = initWebGL("canvas");


// Create WebGL program 
const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

// Set the shader program
gl.useProgram(program);

const texture = loadTexture(gl, "assets/mario.png");

let num=Math.random();

// Define the vertices
let vertices = new Float32Array([
  // x      y     z              
  -0.5, -0.5, 0.0, 1, 0, 0, 0, 0,// vertex 0     3 -- 2
  0.5, -0.5, 0.0, 0, 1, 0, num * Math.random(), 0, // vertex 1     |  / |    
  0.5, 0.5, 0.0, 0, 0, 1, num * Math.random(), num * Math.random(),// vertex 2     | /  | 
  -0.5, 0.5, 0.0, 1, 1, 1, 0, num * Math.random() // vertex 3     0 -- 1 
]);

// Define the indices
const indices = new Uint16Array([
  0, 1, 2,  // lower-right triangle
  0, 2, 3,  // upper-left triangle
]);

// Create mesh
const mesh = createMesh(gl, program, vertices, indices);

// Draw Square
function drawSquare() {
  gl.bindVertexArray(mesh);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);
  gl.bindVertexArray(null);
}


// Render frame
function render() {
  
  gl.clear(gl.COLOR_BUFFER_BIT);

  // draw
  drawSquare();

  // Render next frame
  requestAnimationFrame(render);
}

requestAnimationFrame(render);