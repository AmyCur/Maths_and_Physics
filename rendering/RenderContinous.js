import { MeshCreator } from "./init-buffers.js";
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
import { GetSceneSettings } from "./RenderStart.js";
import { Buffer } from "./Buffer.js";
import { Mesh } from "../game_objects/Mesh.js";
import { Transform } from "../game_objects/Transform.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { MUtil } from "../util/MathUtil.js";

//#region Initialisation


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

    const w1 = MeshCreator.CreateMesh(gl, Buffer.default(), { collider: BoxCollider.default() }, { name: "floor", raycastable: true });
    w1.transform.position = new Vector3(
        (fb.transform.position.x - fb.transform.scale.x + w1.transform.scale.x - (w1.transform.scale.x * 2)),
        0,
        w1.transform.position.z
    )

    w1.transform.scale = new Vector3(
        w1.transform.scale.x,
        20,
        fb.transform.scale.z + 1
    )


    walls.push(w1);

    const w2 = MeshCreator.CreateMesh(gl, Buffer.default(), { collider: BoxCollider.default() }, { name: "w2", raycastable: true });



    w2.transform.position = new Vector3(
        -(fb.transform.position.x - fb.transform.scale.x + w2.transform.scale.x - (w2.transform.scale.x * 2)),
        0,
        w2.transform.position.z
    )

    w2.transform.scale = new Vector3(
        w2.transform.scale.x,
        20,
        fb.transform.scale.z + 1
    )

    walls.push(w2);

    const w3 = MeshCreator.CreateMesh(gl, Buffer.default(), { collider: BoxCollider.default() }, { name: "w3", raycastable: true });



    w3.transform.position = new Vector3(
        w3.transform.position.x,
        0,
        -(fb.transform.position.x - fb.transform.scale.x + w3.transform.scale.x - (w3.transform.scale.x * 2)),
    )

    w3.transform.scale = new Vector3(
        fb.transform.scale.x + 1,
        20,
        w3.transform.scale.z,
    )

    walls.push(w3);


    const w4 = MeshCreator.CreateMesh(gl, Buffer.default(), { collider: BoxCollider.default() }, { name: "w4", raycastable: true });


    w4.transform.position = new Vector3(
        w4.transform.position.x,
        0,
        (fb.transform.position.x - fb.transform.scale.x + w4.transform.scale.x - (w4.transform.scale.x * 2)),
    )

    w4.transform.scale = new Vector3(
        fb.transform.scale.x + 1,
        20,
        w4.transform.scale.z,
    )

    walls.push(w4);


    const wb = Buffer.default();
    wb.color = Mesh.GetColor("red");
    const w5 = MeshCreator.CreateMesh(gl, wb, { collider: ColliderUtils.defaultCollider });

    w5.transform.position = new Vector3(
        30, 0, 30
    )

    w5.transform.scale = new Vector3(
        10, 5, 10
    )




    walls.push(w5);



    // for (let wall of walls) {
    //     wall.SetColor("red");
    // }

    // w1.properties.name = "Wall 1";
    // w2.properties.name = "Wall 2";
    // w3.properties.name = "Wall 3";
    // w4.properties.name = "Wall 4";


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

    player.gl = gl;

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

    const fb = MeshCreator.CreateMesh(gl, Buffer.default(), { collider: BoxCollider.default() }, { name: "floor", raycastable: true });
    fb.transform.scale = new Vector3(100, 1, 100)
    fb.transform.position = new Vector3(0, 0, 0);

    objects.static.push(fb);

    const cb = MeshCreator.CreateMesh(gl, Buffer.default(), { collider: BoxCollider.default() }, { name: "ceiling", raycastable: true });
    cb.transform.scale = new Vector3(100, 1, 100)
    cb.transform.position = new Vector3(0, 30, 0);

    objects.static.push(cb);

    // const walls = CreateWalls(fb, gl);

    // for (let i = 0; i < walls.length; i++) {
    //     const wall = walls[i];

    //     walls[i].components.collider = new BoxCollider(Vector3.zero(), new Vector3(1.1, 1.1, 1.1))

    // }

    // console.log(walls);

    // objects.static.push(...walls);

    return {
        gl: gl,
        programInfo: programInfo
    }
}
//#endregion

//#region Rendering Each Frame




function CreateEnemyBuffer(gl) {
    objects.enemies = [];
    const enemyBuffers = [];

    for (let i = 0; i < EController.enemies.length; i++) {
        const enemy = EController.enemies[i];
        const buffer = Buffer.default();
        buffer.color = Mesh.GetColor("red");
        const eMesh = MeshCreator.CreateMesh(gl, buffer, { enemy: enemy, collider: ColliderUtils.defaultCollider });

        eMesh.transform.position = enemy.transform.position;
        eMesh.transform.scale = enemy.transform.scale;
        eMesh.transform.rotation = enemy.transform.rotation;

        // eb.components.collider = new BoxCollider(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
        eMesh.properties.name = "enemy";


        objects.enemies.push(eMesh);
        enemyBuffers.push(eMesh);
    }

    return enemyBuffers;
}

function CreateMatricies(gl) {
    // Get scene settings
    const s = GetSceneSettings(gl);

    // Init projection matrix
    const projectionMatrix = new Mat4();

    // Set the projection matrix to an actual projection matrix
    projectionMatrix.perspective(s.fieldOfView, s.zNear, s.zFar);

    // Initialise the model view matrix (Not to be confused with the model matrix)
    const modelViewMatrix = new Mat4();

    // Move the world based on player inverted position (so that enemies going towards the player go to the player)
    modelViewMatrix.translate([-player.transform.position.x, -player.transform.position.y - camera.transform.position.y, -player.transform.position.z])

    // Apply viewbobbing
    projectionMatrix.translate([0, Math.sin(input.angle / 1.3) / 5, 0]);


    // Rotate the camera
    projectionMatrix.rotate([1, 0, 0], -camera.transform.rotation.y);
    projectionMatrix.rotate([0, 1, 0], -camera.transform.rotation.x);

    // Return then to be used (obvs)
    return [projectionMatrix, modelViewMatrix];

}


function CreateMeshWithTargets(gl, sp, ep){
    const mesh = MeshCreator.CreateMesh(gl, Buffer.default(), {collider: BoxCollider.default()}, {name: "new obj", raycastable: true});
    
    const tp = VectorUtil.Subtract(ep, sp);
    // mesh.transform.scale = tp
    mesh.transform.position=tp;
    
    mesh.transform.scale = new Vector3(
        MUtil.magnitude(ep.x),
        MUtil.magnitude(ep.y),
        MUtil.magnitude(ep.z),
    )

    mesh.components.collider = BoxCollider.default();

    // mesh.transform.position = VectorUtil.Add(sp, VectorUtil.Multiply(tp, 0.5));
    
    return mesh;
}


export function Render(gl, programInfo) {
    objects.other = [];
   

    // console.log(objects.GetAllObjects());

    // Clear everything
    ReadyScene(gl);

    // Get matricies
    const [projectionMatrix, modelViewMatrix] = CreateMatricies(gl);

    // Get all of the enemies and create buffers for them
    objects.enemies = CreateEnemyBuffer(gl);

    const wall = CreateMeshWithTargets(gl, new Vector3(-100,0,-100), new Vector3(0,20,-100));
    const wall2 = CreateMeshWithTargets(gl, new Vector3(100,0,100), new Vector3(0,20,100));
    objects.other.push(wall);
    objects.other.push(wall2);
    
    // const ob = MeshCreator.CreateMesh(gl, Buffer.default(), {}, {});

    // ob.transform = 
    //     Transform.default()
    //     .SetPosition(VectorUtil.Add(camera.GetCameraPosition(), Vector3.zero()))
    //     .SetScale(new Vector3(0.1,0.1,0.1));

    // objects.other.push(ob);



    /*
        The static buffers and enemy buffers are seperated into individual arrays and worked on differently 
        for simplicity and so that the code can be cleaner
    */

    // Render all static objects (like the floor)
    for (let i = 0; i < objects.static.length; i++) {
        RenderBuffer(gl, objects.static[i], programInfo);
    }

    for (let i = 0; i < objects.other.length; i++) {
        RenderBuffer(gl, objects.other[i], programInfo);
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

function RenderBuffer(gl, mesh, programInfo, vertexCount=36) {

    const modelMatrix = new Mat4();


    modelMatrix.translate([mesh.transform.position.x, mesh.transform.position.y, mesh.transform.position.z]);
    modelMatrix.scale([mesh.transform.scale.x, mesh.transform.scale.y, mesh.transform.scale.z]);

    modelMatrix.rotate([1, 0, 0], mesh.transform.rotation.x);
    modelMatrix.rotate([0, 1, 0], mesh.transform.rotation.y);
    modelMatrix.rotate([0, 0, 1], mesh.transform.rotation.z);

    //* Set the modelMatrix (NOT MODEL VIEW MATRIX)

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelMatrix,
        false,
        modelMatrix.m
    )


    setPositionAttribute(gl, mesh.buffers, programInfo);
    setColorAttribute(gl, mesh.buffers, programInfo);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.buffers.index);
    gl.useProgram(programInfo.program);


    //! RENDERING

    {
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

