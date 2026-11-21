import { BufferCreator } from "./init-buffers.js";
import { input } from "../input/input.js";
import { initShaderProgram } from "./shaders.js";
import { floor, RenderObject } from "./RenderObject.js";
import { player } from "../game_objects/Player.js";
import { camera } from "../game_objects/camera.js";
import { Vector3 } from "../vectors/Vector3.js";
import { EController, EnemyController } from "../enemies/EnemyController.js";
import { Mat4 } from "../vectors/Mat4.js";
import { objects } from "../game_objects/Objects.js";
import { BoxCollider, ColliderUtils } from "../game_objects/Colliders.js";

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


function CreateWalls(fb, gl) {



    const walls = [];

    const w1 = BufferCreator.CreateBufferFromRenderObject(gl, new RenderObject().MakeCube("green"), { collider: new BoxCollider(new Vector3(0, 0, 0), new Vector3(1, 1, 1)) })


    w1.transform.position = new Vector3(
        fb.transform.position.x - fb.transform.scale.x + w1.transform.scale.x - (w1.transform.scale.x * 2),
        0,
        w1.transform.position.z
    )

    w1.transform.scale = new Vector3(
        w1.transform.scale.x,
        20,
        fb.transform.scale.z
    )


    walls.push(w1);

    const w2 = BufferCreator.CreateBufferFromRenderObject(gl, new RenderObject().MakeCube("green"))



    w2.transform.position = new Vector3(
        -(fb.transform.position.x - fb.transform.scale.x + w2.transform.scale.x - (w2.transform.scale.x * 2)),
        0,
        w2.transform.position.z
    )

    w2.transform.scale = new Vector3(
        w2.transform.scale.x,
        20,
        fb.transform.scale.z
    )

    walls.push(w2);

    const w3 = BufferCreator.CreateBufferFromRenderObject(gl, new RenderObject().MakeCube("green"))

    w3.transform.position = new Vector3(
        w3.transform.position.x,
        0,
        -(fb.transform.position.x - fb.transform.scale.x + w3.transform.scale.x - (w3.transform.scale.x * 2)),
    )

    w3.transform.scale = new Vector3(
        fb.transform.scale.x,
        20,
        w3.transform.scale.z,
    )

    walls.push(w3);


    const w4 = BufferCreator.CreateBufferFromRenderObject(gl, new RenderObject().MakeCube("green"))

    w4.transform.position = new Vector3(
        w4.transform.position.x,
        0,
        (fb.transform.position.x - fb.transform.scale.x + w4.transform.scale.x - (w4.transform.scale.x * 2)),
    )

    w4.transform.scale = new Vector3(
        fb.transform.scale.x,
        20,
        w4.transform.scale.z,
    )

    walls.push(w4);


    for (let wall of walls) {
        wall.renderObject.SetColor("red");
    }

    w1.properties.name = "Wall 1";
    w2.properties.name = "Wall 2";
    w3.properties.name = "Wall 3";
    w4.properties.name = "Wall 4";

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

    const fb = BufferCreator.CreateBufferFromRenderObject(gl, floor, { collider: ColliderUtils.defaultCollider });

    objects.static.push(fb);

    const walls = CreateWalls(fb, gl);

    for (let i = 0; i < walls.length; i++) {
        const wall = walls[i];

        wall.components.collider = new BoxCollider(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    }

    console.log(walls);

    objects.static.push(...walls);

    return {
        gl: gl,
        programInfo: programInfo
    }
}
//#endregion

//#region Rendering Each Frame




function CreateEnemyBuffer(gl) {
    objects.enemies=[];
    const enemyBuffers = [];

    for (let i = 0; i < EController.enemies.length; i++) {
        const enemy = EController.enemies[i];
        
        const renderObj = new RenderObject().MakeCube();
        renderObj.colors = renderObj.SetColor("blue");

        const eb = BufferCreator.CreateBufferFromRenderObject(gl, renderObj, { enemy: enemy, collider: ColliderUtils.defaultCollider });

        eb.transform.position = enemy.transform.position;
        eb.transform.scale = enemy.transform.scale;
        eb.transform.rotation = enemy.transform.rotation;

        // eb.components.collider = new BoxCollider(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
        eb.properties.name = "enemy";

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

    // Move the world based on player inverted position (so that enemies going towards the player go to the player)
    modelViewMatrix.translate([-player.transform.position.x, -player.transform.position.y, -player.transform.position.z])

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
        [0, 0, 0, 1]
    )

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix.m,
    );
}

function RenderBuffer(gl, b, programInfo) {

    const modelMatrix = new Mat4();

    // Each of these transformations accesses the renderObj data because everything is a primative


    modelMatrix.translate([b.transform.position.x, b.transform.position.y, b.transform.position.z]);
    modelMatrix.scale([b.transform.scale.x, b.transform.scale.y, b.transform.scale.z]);

    modelMatrix.rotate([1, 0, 0], b.transform.rotation.x);
    modelMatrix.rotate([0, 1, 0], b.transform.rotation.y);
    modelMatrix.rotate([0, 0, 1], b.transform.rotation.z);

    //* Set the modelMatrix

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelMatrix,
        false,
        modelMatrix.m
    )

    setPositionAttribute(gl, b.buffers, programInfo);
    setColorAttribute(gl, b.buffers, programInfo);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b.buffers.index);
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

