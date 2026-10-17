const vsSource = 
`#version 300 es
precision mediump float;

in vec3 aPosition;

void main() {
    gl_Position = vec4(aPosition, 1.0);
}`;

const fsSource = 
`#version 300 es
precision mediump float;

out vec4 fragColour;

void main() {
    fragColour = vec4(1.0, 0.0, 0.0, 1.0);
}`;

function initShaders(gl){
  const vShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const program = gl.createProgram();
  
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  
  gl.linkProgram(program);

  return program;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(`Failed to load shader!! \n ${gl.getShaderInfoLog(shader)}`)
  }

  return shader;
}

export {initShaders};