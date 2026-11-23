
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 modelMatrix;

    uniform vec4 position;
    uniform vec4 scale;

    varying highp vec2 vTextureCoord;
    void main(void) {
        vTextureCoord = aTextureCoord;
        gl_Position = uProjectionMatrix * uModelViewMatrix * modelMatrix  * aVertexPosition;
    }
      
  `;

const fsSource = `
    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform lowp float uHealth;
    
    lowp float lerp(lowp float a, lowp float  b,lowp float t){
        return ((1.0-t)*a+(t*b));
    }
    
    void main(void) {
        highp vec4 tc = texture2D(uSampler, vTextureCoord);

        highp float div = 0.1;

        highp float r = tc.r;
   

        tc=vec4(
            lerp(r*1.5, r,  uHealth),
            lerp(0.0, tc.g,  uHealth),
            lerp(0.0, tc.b,  uHealth),           
            tc.a
        );

        gl_FragColor = tc;
    }
  `;

export function initShaderProgram(gl) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.warn(
            `Unable to initialize the shader program: ${gl.getProgramInfoLog(
                shaderProgram,
            )}`,
        );
        return null;
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//



function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn(
            `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
        );
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}