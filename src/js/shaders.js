const vertexShaderSource =
    `#version 300 es
precision mediump float;

in vec3 aPosition;

void main() {
    gl_Position = vec4(aPosition, 1.0);
}`;

// Define fragment shader
const fragmentShaderSource =
    `#version 300 es
  precision mediump float;

  uniform vec4 uColour;
  out vec4 fragColour;

  void main() {
      fragColour = uColour;
  }`;



function CompileShader(gl, shaderType, shaderSource) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(`Error compiling shader:\n`, gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    return shader;
}

function CompileShaders(gl) {
    const vertexShader = CompileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = CompileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    return program;
}
