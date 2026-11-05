
const vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main(){
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`

const fsSource = `
    

    void main(){
        gl_FragColor = new vec4(1,0,0,1);
    }
`





function LoadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

function InitShaders(gl) {
    const vertexShader = LoadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = LoadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    return program;
}

export {InitShaders};