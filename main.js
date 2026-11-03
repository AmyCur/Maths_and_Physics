
const canvas = document.getElementById('gameCanvas');
const textElement = document.getElementById('textDisplay');
const lifeText = document.getElementById('lifeText');

/** @type {WebGL2RenderingContext} */
const gl = initWebGL(canvas);


const turretPos = { x: 0.0, y: -0.8 };

const activeShips = [];
const shipGenTime = 700;
let lastSpawnTime = 0;
const shipSize = 0.5;
const shipSpeed = 0.01;

const rightBoundry = 0.95;
const leftBoundry = -0.95;
const topBoundry = 0.95;
const buttomBoundry = -0.95;


const keys = { 
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    a: false,
    s: false,
    d: false
};

let aimAngle = Math.PI / 2;
const rotationSpeed = 0.04;

let isAimingAtShip = false;

let activeLasers = [];
const laserSpeed = 0.03;
const fireCooldown = 150;
let lastFireTime = 0;

const laserVertices = [0, 0, 0.1, 0];
const laserIndicies = [0, 1];

const playerPos = {x: 0, y: 0.2, z: 0};
const playerSpeed = 0.015;
const playerSize =0.1;
const playerRadius = 0.04;

const playerVerticies = [
    0,0.5,
    -0.4,-0.5,
    0,-0.2,
    0.4,-0.5
];

const playerIndicies = [
    0,1,2,
    0,2,3
];


function DrawLaser(laserInstance) {
    gl.bindVertexArray(laserMesh.vao)
    setUniforms([0,0.4,0.8,1], laserInstance.x, laserInstance.y, laserInstance.angle);
    gl.drawElements(gl.LINES, laserMesh.indexCount, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
}


// --- SHADER SETUP ---
const vertexShaderSource = `#version 300 es
    precision mediump float;

    in vec3 aPosition;
    uniform vec3 uTranslation;
    uniform float uRotation;
    uniform vec3 uScale;

    void main() {
        vec3 scaled = aPosition * uScale;
        float s = sin(uRotation);
        float c = cos(uRotation);
        vec2 rotated = vec2(
            scaled.x * c - scaled.y * s,
            scaled.x * s + scaled.y * c
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
const scaledLocation = gl.getUniformLocation(shaderProgram, "uScale");
const laserMesh = createMesh(gl, laserVertices, laserIndicies, positionAttribute);
const playerMesh = createMesh(gl, playerVerticies, playerIndicies, positionAttribute);

const turretSegments = 32;
const baseRadius = 0.15;
const turretVerticies = [];
const turretIndicies=[];    

for (let i = 0; i <= turretSegments; i++) {
    const angleCircle = (i * 2 * Math.PI) / turretSegments;
    turretVerticies.push(baseRadius * Math.cos(angleCircle),
        baseRadius * Math.sin(angleCircle));
    turretIndicies.push(i);
}

turretVerticies.push(0.0, 0.0, 0.3, 0.0);

const turretBuffer = createShapeBuffer(gl, turretVerticies);

function processInput(currentTime) {
    if(keys.ArrowUp || keys.w) playerPos.y+=playerSpeed
    if(keys.ArrowDown || keys.s) playerPos.y-=playerSpeed
    if(keys.ArrowLeft|| keys.a) playerPos.x-=playerSpeed
    if(keys.ArrowRight || keys.d) playerPos.x+=playerSpeed
}
let lives=3;

function update(currentTime) {
    // if(lives<=0) close();

    // isAimingAtShip=false;
    // const turretDirVector = {x: Math.cos(aimAngle), y: Math.sin(aimAngle)};
    // const targetDirVector = {
    //     x: shipCentre.x - turretPos.x,
    //     y: shipCentre.y - turretPos.y
    // };
    // const targetDirLength = Math.sqrt(targetDirVector.x * targetDirVector.x + targetDirVector.y * targetDirVector.y);
    // const unitTargetDirVector = {
    //     x:targetDirVector.x/targetDirLength,
    //     y:targetDirVector.y/targetDirLength
    // };
    
    // if(targetDirLength>0){
    //     const dotProduct = DotProduct(turretDirVector, unitTargetDirVector);
    //     if(dotProduct > 0.98) isAimingAtShip=true;
    // }
    for(let i = activeLasers.length-1; i >= 0; i--){
        const laser=activeLasers[i];
        laser.x+=laser.vx;
        laser.y+=laser.vy;

        if(laser.y > 1.1 || laser.x > 1.1 || laser.x < -1.1 || laser.y < -1.1){
            activeLasers.splice(i, 1);
            continue;
        }
    }
}

let score =0;

function GameLoop(timestamp) {
    processInput(timestamp);
    update(timestamp);
    render();
    requestAnimationFrame(GameLoop);
}

window.addEventListener("keydown", (event) => {
    if(keys.hasOwnProperty(event.key)) keys[event.key]=true;
})

window.addEventListener("keyup", (event) => {
    if(keys.hasOwnProperty(event.key)) keys[event.key]=false;
})

function DotProduct(a, b) {
    return (a.x * b.x) + (a.y * b.y)
}

function drawPlayer(currentPlayerPos){
    gl.bindVertexArray(playerMesh.vao);
    setUniforms([0.0,0.4,0.8,1.0],  
    currentPlayerPos.x,currentPlayerPos.y,Math.PI,playerSize);
    gl.drawElements(gl.TRIANGLES, playerMesh.indexCount, gl.UNSIGNED_SHORT,0);
    gl.bindVertexArray(null);
}


// --- RENDER HELPERS ---
function setUniforms(colour, transX, transY, rotation, scale=1) {
    gl.uniform4fv(colourLocation, colour);
    gl.uniform3f(translationLocation, transX, transY, 0);
    gl.uniform1f(rotationLocation, rotation);
    gl.uniform3f(scaledLocation, scale, scale, 1.0);
}


const barrelIndex = turretSegments+1;
turretIndicies.push(barrelIndex, barrelIndex+1);
const turretMesh=createMesh(gl, turretVerticies, turretIndicies, positionAttribute);


function drawGunTurret(x, y, color, rotation) {
    gl.bindVertexArray(turretMesh.vao);
    setUniforms(color, x,y,rotation);
    gl.drawArrays(gl.LINE_LOOP,0,turretSegments+1);
    gl.drawArrays(gl.LINES, turretSegments+1, 2);
    gl.drawElements(gl.LINE_LOOP, turretSegments+1, gl.UNSIGNED_SHORT, 0);
    gl.drawElements(gl.LINES, 2, gl.UNSIGNED_SHORT, (turretSegments+1)*2);
}



// --- RENDER ---
function render() {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let turretColor = [0.0, 0.584, 0.867, 1];
    if (isAimingAtShip) {
        turretColor = [1, 0, 0, 1];
    }
    drawGunTurret(turretPos.x, turretPos.y, turretColor, aimAngle);
    drawPlayer(playerPos);
    for (let i = 0; i < activeLasers.length; i++) {
        DrawLaser(activeLasers[i]);
    }
}

requestAnimationFrame(GameLoop);
