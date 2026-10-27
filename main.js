
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
const shipSpeed = 0.05;

const shipVerticies = [
    0.05, -0.05, 0, 0, 0.1, 0, 0, 0.1, 0.1, 0.1
];

const shipBuffer = createShapeBuffer(gl, shipVerticies);

const keys = { ArrowLeft: false, ArrowRight: false, Space: false };

let aimAngle = Math.PI / 2;
const rotationSpeed = 0.04;

let isAimingAtShip = false;

let activeLasers = [];
const laserSpeed = 0.03;
const fireCooldown = 150;
let lastFireTime = 0;

const laserVerticies = [0, 0, 0.1, 0];
const laserBuffer = createShapeBuffer(gl, laserVerticies);

function DrawLaser(laserInstance) {
    bindStateAndUniforms(laserBuffer, [1, 0, 0, 1],
        laserInstance.x, laserInstance.y, laserInstance.angle
    );
    gl.drawArrays(gl.LINES, 0, 2);
}


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

for (let i = 0; i <= turretSegments; i++) {
    const angleCircle = (i * 2 * Math.PI) / turretSegments;
    turretVerticies.push(baseRadius * Math.cos(angleCircle),
        baseRadius * Math.sin(angleCircle));
}

turretVerticies.push(0.0, 0.0, 0.3, 0.0);

const turretBuffer = createShapeBuffer(gl, turretVerticies);

function processInput(currentTime) {
    if (!textElement) return;
    if (keys.ArrowLeft) aimAngle += rotationSpeed;
    if (keys.ArrowRight) aimAngle -= rotationSpeed;

    const elapsedTime =  currentTime-lastFireTime;

    if(keys.Space && elapsedTime >= fireCooldown){
        activeLasers.push({
            x: turretPos.x,
            y: turretPos.y,
            vx: Math.cos(aimAngle) * laserSpeed,
            vy: Math.sin(aimAngle) * laserSpeed,
            angle: aimAngle
        })
        lastFireTime=currentTime;
    }
}

let lives=3;

function update(currentTime) {
    if(lives<=0) close();

    const elapsedTime = currentTime - lastSpawnTime;
    // @ts-ignore
    textElement.innerHTML=(`Score: ${score}`);
    // @ts-ignore
    lifeText.innerHTML=`Lives: ${lives}`;

    if (elapsedTime >= shipGenTime) {
        let randomX = (Math.random() * (2.0 - shipSize)) - 1;
        activeShips.push({ x: randomX, y: 1.0 });
        lastSpawnTime = currentTime;
    }

    for (let i = 0; i < activeShips.length; i++) {
        const shipPosition = activeShips[i];
        shipPosition.y -= shipSpeed;

        isAimingAtShip = false;
        const turretDirVector = { x: Math.cos(aimAngle), y: Math.sin(aimAngle) };

        const shipCentre = {
            x: shipPosition.x + (shipSize / 2),
            y: shipPosition.y + (shipSize / 2)
        };

        const targetDirVector = { x: shipCentre.x - turretPos.x, y: shipCentre.y - turretPos.y };
        const targetDirLength = Math.sqrt(targetDirVector.x * targetDirVector.x + targetDirVector.y * targetDirVector.y);
        const unitTargetDirVector = { x: targetDirVector.x / targetDirLength, y: targetDirVector.y / targetDirLength };
        if (targetDirLength > 0) {
            const dp = DotProduct(turretDirVector, unitTargetDirVector);
            if (dp > 0.98) isAimingAtShip = true;
        }

        if(shipPosition.y < -1.1){
            lives--;
            activeShips.splice(i,1);
        }
    }

    for(let i = 0; i < activeLasers.length; i++){
        const laser=activeLasers[i];
        laser.x+=laser.vx;
        laser.y+=laser.vy ;

        if(laser.y>1.1 || laser.x >1.1 || laser.y <-1.1 || laser.x < -1.1){
            activeLasers.splice(i,1);
            continue;
        }

        for(let j = activeShips.length-1; j >= 0; j--){
            const shipPos=activeShips[j];
            if(laser.x >= shipPos.x
                && laser.x <= shipPos.x + shipSize
                && laser.y >= shipPos.y
                && laser.y <= shipPos.y + shipSize
            ){
                activeShips.splice(j,1);
                activeLasers.splice(i,1);
                score++;
                break;
            }
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
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        keys[event.key] = true;
        event.preventDefault();
    }

    if (event.key === " " || event.code === "Space    ") {
        keys.Space = true;
        event.preventDefault();
    }
})

window.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        keys[event.key] = false;
        event.preventDefault();
    }

    if (event.key === " " || event.code === "Space    ") {
        keys.Space = false;
        event.preventDefault();
    }
})

function DotProduct(a, b) {
    return (a.x * b.x) + (a.y * b.y)
}


// --- RENDER HELPERS ---
function bindStateAndUniforms(buffer, colour, x, y, rotation) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colourLocation, colour);
    gl.uniform3f(translationLocation, x, y, 0.0);
    gl.uniform1f(rotationLocation, rotation);
}

function drawGunTurret(x, y, color, aimAngle) {
    bindStateAndUniforms(turretBuffer, color, x, y, aimAngle);
    gl.drawArrays(gl.LINE_LOOP, 0, turretSegments + 1);
    gl.drawArrays(gl.LINES, turretSegments + 1, 2);
}

function drawShip(x, y) {
    bindStateAndUniforms(shipBuffer, [0.0, 0.0, 0.0, 1.0], x, y, 0.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);
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
    for (let i = 0; i < activeShips.length; i++) {
        const shipPosition = activeShips[i];
        drawShip(shipPosition.x, shipPosition.y);
    }

    for (let i = 0; i < activeLasers.length; i++) {
        DrawLaser(activeLasers[i]);
    }
}

requestAnimationFrame(GameLoop);
