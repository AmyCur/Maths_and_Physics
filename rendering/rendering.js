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


export function InitRendering() {
    Raycast.allObjects = [];

    const canvas = document.getElementById("gl-canvas");

    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (gl === null) {
        console.warn(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
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


    const modelMatrix = new Mat4();


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
        },
    };

    //* Create the buffers
    const cb = initBuffersPrimative(gl, cube);
    const fb = initBuffersPrimative(gl, floor);



    Raycast.allObjects.push(fb);




    const crossHair = initBuffersPrimative(gl, new Primative().MakeCube());

    // crossHair.prim.position=new Vector3(1,5,0);

    return {
        gl: gl,
        programInfo: programInfo,
        buffers: {
            UI: [],
            World: [fb],
        }
    }
}
//#endregion

//#region Rendering Each Frame

function CreateEnemyBuffer(gl){
    const enemyBuffers = [];

    for(let i = 0; i < EController.enemies.length; i++){
        const prim = new Primative().MakeCube();
        prim.SetPosition(EController.enemies[i].position);
        prim.SetScale(EController.enemies[i].scale);
        prim.SetRotation(EController.enemies[i].rotation);
        
        const eb = initBuffersPrimative(gl, prim);
        Raycast.allObjects.push(eb);

        enemyBuffers.push(eb);
    }

    return enemyBuffers;
}

export function Render(gl, programInfo, buffers) {
    ReadyScene(gl);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.


    const s = GetSceneSettings(gl);

    // note: glMatrix always has the first argument
    // as the destination to receive the result.


    // Set the drawing position to the "identity" point, which is
    // the center of the scene.


    const projectionMatrix = new Mat4();
    projectionMatrix.perspective(s.fieldOfView, s.zNear, s.zFar);
    const modelViewMatrix = new Mat4();

    modelViewMatrix.translate([player.position.x,player.position.y,player.position.z])

    // projectionMatrix.translate([0, Math.sin(input.angle) / 7, 0]);
    

    projectionMatrix.rotate([1,0,0], -camera.rotation.y);
    projectionMatrix.rotate([0,1,0], -camera.rotation.x);

    // note: glMatrix always has the first argument
    // as the destination to receive the result.
  

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
 

   

    // mat4.translate(
    //     modelViewMatrix,
    //     modelViewMatrix,
    //     [0, Math.sin(input.angle) / 7, 0]
    // );

    // mat4.rotateX(
    //     projectionMatrix,
    //     projectionMatrix,
    //     -camera.rotation.y
    // )

    // mat4.rotateY(
    //     projectionMatrix,
    //     projectionMatrix,
    //     -camera.rotation.x
    // )

    


    const enemyBuffers = CreateEnemyBuffer(gl);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.

    for (const b of buffers.World) {
        RenderBuffer(gl, b, programInfo);
    }


    for (const b of buffers.UI) {
        RenderBuffer(gl, b, programInfo);
    }


    for (let i = 0; i < enemyBuffers.length; i++) {
        RenderBuffer(gl, enemyBuffers[i], programInfo);
    }






    // Tell WebGL to use our program when drawing


    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix.m,
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix.m,
    );
}

function RenderBuffer(gl, b, programInfo) {

    const modelMatrix = new Mat4();
    modelMatrix.translate([b.prim.position.x, b.prim.position.y, b.prim.position.z]);
    modelMatrix.scale([b.prim.scale.x, b.prim.scale.y, b.prim.scale.z]);
    
    modelMatrix.rotate([1,0,0],b.prim.rotation.x);
    modelMatrix.rotate([0,1,0],b.prim.rotation.y);
    modelMatrix.rotate([0,0,1],b.prim.rotation.z);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelMatrix,
        false,
        modelMatrix.m
    )

    // gl.uniform4fv(
    //     programInfo.uniformLocations.position,
    //     [
    //         b.prim.position.x,
    //         b.prim.position.y,
    //         b.prim.position.z,
    //         1
    //     ],
    // );

    // gl.uniform4fv(
    //     programInfo.uniformLocations.scale,
    //     [
    //         b.prim.scale.x,
    //         b.prim.scale.y,
    //         b.prim.scale.z,
    //         1
    //     ]
    // );

    setPositionAttribute(gl, b, programInfo);
    setColorAttribute(gl, b, programInfo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b.indices);
    gl.useProgram(programInfo.program);

    const f = 36;

    {
        const vertexCount = f;
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

