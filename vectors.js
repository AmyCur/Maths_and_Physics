// Setup WebGL
const canvas = document.getElementById("canvas");

/** @type {WebGL2RenderingContext} */
const gl = initWebGL(canvas);
gl.enable(gl.DEPTH_TEST);


// Define vertex shader
const vertexShaderSource =
  `#version 300 es
  precision mediump float;

  in vec3 aPosition;
uniform float uScale;
  void main() {
        gl_Position = vec4(aPosition/uScale, 1.0);  
        gl_PointSize = 8.0; // Sets the point size
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

function printVector(v) {
  return `[ ${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)} ]`;
}

function printPoint(v) {
  return `[ ${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)} ]`;
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
function drawVector(vector, colour, positionLocation, colourLocation) {
  // Define the line starting from the origin to the vector's coordinates
  const vectorData = new Float32Array([
    0.0, 0.0, 0.0,
    vector[0], vector[1], vector[2]
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
// render function



function render() {

  const textElement = document.getElementById('textDisplay');

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

  // Locate and set the new canvas scale uniform
  const scaleLocation = gl.getUniformLocation(program, "uScale");
  gl.uniform1f(scaleLocation, 10.0); // Sets the coordinate range from -10 to +10
  // Points
  const a = [3, 0, 4];
  const b = [1, 2, 3];

  const abAddition = addVector(a, b);
  const abSubTraction = subtractVector(a, b);

  const aScaled = scaleVector(a, 2);
  const bScaled = scaleVector(b, 1 / 3);

  const aLen = getVectorLength(a);
  const bLen = getVectorLength(b);

  const aHat = normaliseVector(a);
  const bHat = normaliseVector(b);

  // Print text
  textElement.innerText += '\Points\n-------\n';
  textElement.innerText += "a = " + printPoint(a) + "\n";
  textElement.innerText += "b = " + printPoint(b) + "\n";
  textElement.innerText += '\nResults\n-------\n';
  textElement.innerText += '\nArithmetic operations on vectors\n--------------------------------\n';
  textElement.innerText += "a+b = " + printVector(abAddition) + "\n";
  textElement.innerText += "a-b = " + printVector(abSubTraction) + "\n";
  textElement.innerText += "2a = " + aScaled + "\n";
  textElement.innerText += "b/3 = " + bScaled + "\n";
  // Vector magnitude and normalization
  textElement.innerText += '\nVector magnitude and normalization\n----------------------------------\n';
  textElement.innerText += "getVectorLength(a) = " + aLen + "\n";
  textElement.innerText += "getVectorLength(b) = " + bLen + "\n";
  textElement.innerText += "aHat = " + printVector(aHat) + "\n";
  textElement.innerText += "bHat = " + printVector(bHat) + "\n";
  const angleInDegress = 90;
  const angleInRadians = angleInDegress * Math.PI / 180;

  textElement.innerText += '\nMath library\n------------\n';
  textElement.innerText += `${angleInDegress} degrees is ${angleInRadians.toFixed(4)} radians.\n`;
  textElement.innerText += `cos(${angleInDegress} degrees) = ${Math.cos(angleInRadians)}\n`;

  //print length of normalised vectors
  textElement.innerText += "getVectorLength(aHat) = " + getVectorLength(aHat) + "\n";
  textElement.innerText += "getVectorLength(bHat) = " + getVectorLength(bHat) + "\n";

  drawVector(aHat, [1.0, 0.0, 1.0, 1.0], positionLocation, colourLocation);
  drawVector(bHat, [1.0, 1.0, 0.0, 1.0], positionLocation, colourLocation);

  drawVector(a, [1.0, 0.0, 1.0, 1.0], positionLocation, colourLocation);
  drawVector(b, [1.0, 1.0, 0.0, 1.0], positionLocation, colourLocation);

  drawVector(abAddition, [0.0, 1.0, 0.0, 1.0], positionLocation, colourLocation);
  drawVector(abSubTraction, [1.0, 0.0, 0.0, 1.0], positionLocation, colourLocation);

  drawVector(aScaled, [1.0, 0.0, 1.0, 1.0], positionLocation, colourLocation);
  drawVector(bScaled, [1.0, 1.0, 0.0, 1.0], positionLocation, colourLocation);
}

render();