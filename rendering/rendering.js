import { initBuffersPrimative } from "./init-buffers.js";
import { input } from "../input/input.js";
import { initShaderProgram } from "./shaders.js";
import { cube, defaultCubeData, floor, Primative } from "./Primative.js";
import { player } from "../game_objects/Player.js";
import { camera } from "../game_objects/camera.js";
import { Vector3 } from "../vectors/Vector3.js";
import { EController, EnemyController } from "../enemies/EnemyController.js";
import { Mat4 } from "../vectors/Mat4.js";
import { Raycast } from "../input/Raycast.js";
import { objects } from "../game_objects/Objects.js";
import { Random } from "../util/Random.js";

//#region Initialisation
function GetSceneSettings(gl) {
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 1000.0;

    return {
        fieldOfView: fieldOfView,
        aspect: aspect,
        zNear: zNear,
        zFar: zFar
    };
}

function ReadyScene(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


function CreateWalls(fb, gl){
    
    const walls = [];


    const w1 = initBuffersPrimative(gl, new Primative().MakeCube("green"))
    

    w1.prim.position = new Vector3(
        fb.prim.position.x-fb.prim.scale.x+w1.prim.scale.x-(w1.prim.scale.x*2),
        0,
        w1.prim.position.z
    )

    w1.prim.scale = new Vector3(
    w1.prim.scale.x,
        20,
        fb.prim.scale.z
    )


    walls.push(w1); 
    
    const w2 = initBuffersPrimative(gl, new Primative().MakeCube("green"))



    w2.prim.position = new Vector3(
        -(fb.prim.position.x-fb.prim.scale.x+w2.prim.scale.x-(w2.prim.scale.x*2)),
        0,
        w2.prim.position.z
    )

    w2.prim.scale = new Vector3(
        w2.prim.scale.x,
        20,
        fb.prim.scale.z
    )

    walls.push(w2); 

    const w3 = initBuffersPrimative(gl, new Primative().MakeCube("green"))

    w3.prim.position = new Vector3(
        w3.prim.position.x,
        0,
        -(fb.prim.position.x-fb.prim.scale.x+w3.prim.scale.x-(w3.prim.scale.x*2)),
    )

    w3.prim.scale = new Vector3(
        fb.prim.scale.x,
        20,
        w3.prim.scale.z,
    )

    walls.push(w3); 


    const w4 = initBuffersPrimative(gl, new Primative().MakeCube("green"))

    w4.prim.position = new Vector3(
        w4.prim.position.x,
        0,
        (fb.prim.position.x-fb.prim.scale.x+w4.prim.scale.x-(w4.prim.scale.x*2)),
    )

    w4.prim.scale = new Vector3(
        fb.prim.scale.x,
        20,
        w4.prim.scale.z,
    )

    walls.push(w4); 
    

    for(let wall of walls){
        wall.prim.SetColor("red");
    }

    return walls;
}

export function InitRendering() {

    


    const canvas = document.getElementById("gl-canvas");

    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (gl === null) {
        console.warn(
            "Unable to initialize WebGL",
        );
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established.
    const shaderProgram = initShaderProgram(gl);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            modelMatrix: gl.getUniformLocation(shaderProgram, "modelMatrix"),
            depth: gl.getUniformLocation(shaderProgram, "depth")
        },
    };

    //* Create the buffers

    const fb = initBuffersPrimative(gl, floor);
        
    objects.static.push(fb);

    const walls = CreateWalls(fb, gl);

    objects.static.push(...walls);




    const crossHair = initBuffersPrimative(gl, new Primative().MakeCube());

    // crossHair.prim.position=new Vector3(1,5,0);

    return {
        gl: gl,
        programInfo: programInfo

    }
}
//#endregion

//#region Rendering Each Frame

function CreateEnemyBuffer(gl) {
    const enemyBuffers = [];

    for (let i = 0; i < EController.enemies.length; i++) {
        const prim = new Primative().MakeCube();
        prim.SetPosition(EController.enemies[i].position);
        prim.SetScale(EController.enemies[i].scale);
        prim.SetRotation(EController.enemies[i].rotation);

        const eb = initBuffersPrimative(gl, prim, EController.enemies[i]);
        objects.enemies.push(eb);

        enemyBuffers.push(eb);
    }

    return enemyBuffers;
}

function InitMatricies(gl) {
    // Get scene settings
    const s = GetSceneSettings(gl);
    
    // Init projection matrix
    const projectionMatrix = new Mat4();

    // Set the projection matrix to an actual projection matrix
    projectionMatrix.perspective(s.fieldOfView, s.zNear, s.zFar);

    // Initialise the model view matrix (Not to be confused with the model matrix)
    const modelViewMatrix = new Mat4();

    // Move the world based on player position
    modelViewMatrix.translate([player.position.x, player.position.y, player.position.z])

    // Apply viewbobbing
    projectionMatrix.translate([0, Math.sin(input.angle) / 7, 0]);

    // Rotate the camera
    projectionMatrix.rotate([1, 0, 0], -camera.rotation.y);
    projectionMatrix.rotate([0, 1, 0], -camera.rotation.x);

    // Return then to be used (obvs)
    return [projectionMatrix, modelViewMatrix];

}

export function Render(gl, programInfo) {
    
    // Clear everything
    ReadyScene(gl);

    // Get matricies
    const [projectionMatrix, modelViewMatrix] = InitMatricies(gl);

    // Get all of the enemies and create buffers for them
    objects.enemies = CreateEnemyBuffer(gl);

    /*
        The static buffers and enemy buffers are seperated into individual arrays and worked on differently 
        for simplicity and so that the code can be cleaner
    */

    // Render all static objects (like the floor)
    for (const b of objects.static) {
        RenderBuffer(gl, b, programInfo);
    }

    // Render all the enemies 
    for (let i = 0; i < objects.enemies.length; i++) {
        RenderBuffer(gl, objects.enemies[i], programInfo);
    }

    // Assign the projection matrix and model view matrix
    //? Note that the mode matrix (not the mode view matrix) is set on a per buffer basis
    //? hence it is set in the RenderBuffer() function

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix.m,
    );

    gl.uniform4fv(
        programInfo.uniformLocations.depth,
        [0,0,0,1]
    )

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix.m,
    );
}

function RenderBuffer(gl, b, programInfo) {

    const modelMatrix = new Mat4();

    // Each of these transformations accesses the prim data because everything is a primative
    modelMatrix.translate([b.prim.position.x, b.prim.position.y, b.prim.position.z]);
    modelMatrix.scale([b.prim.scale.x, b.prim.scale.y, b.prim.scale.z]);

    modelMatrix.rotate([1, 0, 0], b.prim.rotation.x);
    modelMatrix.rotate([0, 1, 0], b.prim.rotation.y);
    modelMatrix.rotate([0, 0, 1], b.prim.rotation.z);

    //* Set the modelMatrix

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelMatrix,
        false,
        modelMatrix.m
    )

    setPositionAttribute(gl, b, programInfo);
    setColorAttribute(gl, b, programInfo);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b.indices);
    gl.useProgram(programInfo.program);


    //! RENDERING

    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl, buffers, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setColorAttribute(gl, buffers, programInfo) {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}
//#endregion

