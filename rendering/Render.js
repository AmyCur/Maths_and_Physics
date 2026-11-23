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
import { CreateWalls, GenerateStaticMeshs } from "./RenderingHack.js";
import { loadTexture } from "./Textures.js";

//#region Initialisation


function ReadyScene(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
            textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            modelMatrix: gl.getUniformLocation(shaderProgram, "modelMatrix"),
            uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
        },
    };

    //* Create the buffers

    const fb = GenerateStaticMeshs(gl);

    const walls = CreateWalls(fb, gl);
    objects.static.push(...walls);

    // for (let i = 0; i < walls.length; i++) {
    //     const wall = walls[i];

    //     walls[i].components.collider = new BoxCollider(Vector3.zero(), new Vector3(1.1, 1.1, 1.1))

    // }

    // console.log(walls);


    return {
        gl: gl,
        programInfo: programInfo
    }
}
//#endregion

//#region Rendering Each Frame





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


function ResetBuffers() {
    objects.other = [];
    // objects.enemies =    [];
    objects.colliders = [];
}

export function Render(gl, programInfo) {
    ResetBuffers();

    // console.log(objects.GetAllObjects());

    // Clear everything
    ReadyScene(gl);

    // Get matricies
    const [projectionMatrix, modelViewMatrix] = CreateMatricies(gl);

    // Get all of the enemies and create buffers for them
    // objects.enemies = EnemyController.CreateEnemyMeshs(gl);

    // const wall = CreateMeshWithTargets(gl, new Vector3(-100,0,-99), new Vector3(0,20,-100));
    // const wall2 = CreateMeshWithTargets(gl, new Vector3(100,0,99), new Vector3(0,20,100));
    // objects.other.push(wall);
    // objects.other.push(wall2);

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

function RenderBuffer(gl, mesh, programInfo, vertexCount = 36) {

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

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.buffers.index);
    player.gl.pixelStorei(player.gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, mesh.texture);

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    // setTextureAttribute(gl, mesh.buffers, programInfo);
    setPositionAttribute(gl, mesh.buffers, programInfo);
    setTextureAttribute(gl, mesh.buffers, programInfo);

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


function setTextureAttribute(gl, buffers, programInfo) {
    const num = 2; // every coordinate composed of 2 values
    const type = gl.FLOAT; // the data in the buffer is 32-bit float
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set to the next
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoord);
    gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        num,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}
//#endregion

