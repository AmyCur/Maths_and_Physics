
const canvas = document.getElementById('gameCanvas');
const textElement = document.getElementById('textDisplay');

/** @type {WebGL2RenderingContext} */
const gl = initWebGL(canvas);


const turretPos = {x: 0.0, y: -0.8};

const shipPosition = {x:0.6, y:0.9};
const shipSize=1;
const shipSpeed=0.005;

const keys = {ArrowLeft: false, ArrowRight: false};

let aimAngle = Math.PI/2;
const rotationSpeed=0.04;


// --- SHADER SETUP ---
const vertexShaderSource = `#version 300 es
    precision mediump float;

    in vec3 aPosition;
    uniform vec3 uTranslation;
    uniform float uRotation;

    void main() {
        float s = sin(uRotation);
        float c = cos(uRotation);
        vec2 rotated = vec2(
            aPosition.x*c - aPosition.y*s,
            aPosition.x*s + aPosition.y * c
        );
        gl_Position = vec4(vec3(rotated, 0.0) + uTranslation,1.0);
    }
`;

const fragmentShaderSource = `#version 300 es
    precision mediump float;
    uniform vec4 uColour;
    out vec4 fragColour;

    void main() {
        fragColour = uColour;
    }
`;

const shaderProgram = createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(shaderProgram);

const positionAttribute = gl.getAttribLocation(shaderProgram, 'aPosition');
const colourLocation = gl.getUniformLocation(shaderProgram, "uColour");
const translationLocation = gl.getUniformLocation(shaderProgram, "uTranslation");
const rotationLocation = gl.getUniformLocation(shaderProgram, "uRotation");

const turretSegments = 32;
const baseRadius = 0.15;
const turretVerticies = [];

for(let i = 0; i <= turretSegments; i++){
    const angleCircle = (i * 2 * Math.PI) / turretSegments;
    turretVerticies.push(baseRadius * Math.cos(angleCircle),
    baseRadius * Math.sin(angleCircle));
}

turretVerticies.push(0.0,0.0,0.3,0.0);

const turretBuffer = createShapeBuffer(gl, turretVerticies);

function processInput(){
    if(!textElement) return;
    if(keys.ArrowLeft) aimAngle+=rotationSpeed;
    if(keys.ArrowRight) aimAngle-=rotationSpeed;
}

function update(){

}

function GameLoop(){
    processInput();
    update();
    render();
    requestAnimationFrame(GameLoop);
}

window.addEventListener("keydown", (event) => {
    if(event.key === "ArrowLeft" || event.key === "ArrowRight"){
        keys[event.key]=true;
        event.preventDefault();
    }
})

window.addEventListener("keyup", (event) => {
    if(event.key === "ArrowLeft" || event.key === "ArrowRight"){
        keys[event.key]=false;
        event.preventDefault();
    }
})


// --- RENDER HELPERS ---
function bindStateAndUniforms(buffer, colour, x, y, rotation) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colourLocation, colour);
    gl.uniform3f(translationLocation, x, y, 0.0);
    gl.uniform1f(rotationLocation, rotation);
}

function drawGunTurret(x,y,color, aimAngle){
    bindStateAndUniforms(turretBuffer,  color, x, y, aimAngle);
    gl.drawArrays(gl.LINE_LOOP, 0, turretSegments + 1);
    gl.drawArrays(gl.LINES, turretSegments + 1, 2);
}

// --- RENDER ---
function render() {
    gl.clearColor(1.0, 1.0, 1.0, 1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    const turretColor = [0.0, 0.584, 0.867, 1];
    drawGunTurret(turretPos.x, turretPos.y, turretColor, aimAngle);
}

requestAnimationFrame(GameLoop);
