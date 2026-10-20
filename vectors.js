

// Setup WebGL
const canvas = document.getElementById("canvas");

/** @type {WebGL2RenderingContext} */
const gl = initWebGL(canvas);
gl.enable(gl.DEPTH_TEST);


// Define vertex shader
const vertexShaderSource =
  `#version 300 es
  precision mediump float;
  uniform float uScale;

  in vec3 aPosition; // Sets the point size
  
  void main() {
        gl_Position = vec4(aPosition/uScale, 1.0);
        gl_PointSize = 8.0;
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



function printPoint(v) {
  return `[ ${v.x}, ${v.y}, ${v.z} ]`;
}

function printVector(v) {
  return `[ ${v.x}, ${v.y}, ${v.z} ]`;
}

function addVector(a, b) {1
  return {x: a.x + b.x, y: a.y + b.y, z: a.z + b.z};
}

function subtractVector(a, b) {
  return {x: a.x - b.x, y: a.y - b.y, z: a.z - b.z};
}

function drawVector(vector, colour, positionLocation, colourLocation) {
  // Define the line starting from the origin to the vector's coordinates
  const vectorData = new Float32Array([
    0.0, 0.0, 0.0,
    vector.x, vector.y, vector.z
  ]);

  // Allocate GPU memory and upload data
  const buffer = createShapeBuffer(gl, vectorData);

  // Configure attributes and uniforms
  setupDrawState(gl, buffer, colour, positionLocation, colourLocation);

  // Draw the vector as a line (2 vertices)
  gl.drawArrays(gl.LINES, 0, 2);

  // Draw a point at the end vertex (index 1) to represent the vector tip
  gl.drawArrays(gl.POINTS, 1, 1);

  // Clean up
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}


function drawPoint(point, colour, positionLocation, colourLocation) {
  // Define the line starting from the origin to the vector's coordinates
  const pointData = new Float32Array(point);
  // Allocate GPU memory and upload data
  const buffer = createShapeBuffer(gl, pointData);
  // Configure attributes and uniforms
  setupDrawState(gl, buffer, colour, positionLocation, colourLocation);
  // Draw a point
  gl.drawArrays(gl.POINTS, 0, 1);
  // Clean up
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

// render function
function render() {

  const textElement = document.getElementById('textDisplay');
  if (textElement) textElement.innerText += '\nResults\n-------\n';

  if (!textElement) {
    console.log("textElement not found");
    return;
  }

  // Create WebGL program 
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  // Set the shader program
  gl.useProgram(program);

  // Find the memory addresses of the variables on the GPU
  const positionLocation = gl.getAttribLocation(program, "aPosition");
  const colourLocation = gl.getUniformLocation(program, "uColour");
  const scaleLocation = gl.getUniformLocation(program, "uScale");

  // Points
  const a = {
    x: 1,
    y: 3,
    z: 3
  };

  const b = {
    x: -8,
    y: -2,
    z: 3
  };

  // Print text
  textElement.innerText += '\Points\n-------\n';
  textElement.innerText += "a = " + printPoint(a) + "\n";
  textElement.innerText += "b = " + printPoint(b) + "\n";



  gl.uniform1f(scaleLocation, 10.0); // Sets the coordinate range from -10 to +10

  drawVector(a, [1.0, 0.0, 1.0, 1.0], positionLocation, colourLocation);
  drawVector(b, [1.0, 1.0, 0.0, 1.0], positionLocation, colourLocation);

  const abAddition = addVector(a, b);
  const abSubTraction = subtractVector(a, b);

  textElement.innerText += '\nArithmetic operations on vectors\n--------------------------------\n';
  textElement.innerText += "a+b = " + printVector(abAddition) + "\n";
  textElement.innerText += "a-b = " + printVector(abSubTraction) + "\n";

  drawVector(abAddition, [0.0, 1.0, 0.0, 1.0], positionLocation, colourLocation);
  drawVector(abSubTraction, [1.0, 0.0, 0.0, 1.0], positionLocation, colourLocation);
}

document.addEventListener("DOMContentLoaded", () => render());