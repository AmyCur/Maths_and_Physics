import { camera } from "../input/camera.js";
import { player } from "../input/Player.js";

export const cameraRot = {x: 0, y: 0};


function GetSceneSettings(gl){
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;

    return {
        fieldOfView: fieldOfView,
        aspect: aspect,
        zNear: zNear,
        zFar: zFar
    };
}


function ReadyScene(gl){
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function drawScene(gl, programInfo, buffers) {
    
    ReadyScene(gl);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.


    const ss = GetSceneSettings(gl);

    const projectionMatrix = mat4.create();

    // note: glMatrix always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix, ss.fieldOfView, ss.aspect, ss.zNear, ss.zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    

    mat4.translate(
        modelViewMatrix,
        modelViewMatrix,
        [player.position.x,player.position.y,player.position.z]
    );

    mat4.rotateX(
        projectionMatrix,
        projectionMatrix,
        -camera.rotation.y
    )

    mat4.rotateY(
        projectionMatrix,
        projectionMatrix,
        -camera.rotation.x
    )

    



    const sens = 1;

    // cameraRot.y+=sens*rotation.y/100;
    // cameraRot.x+=sens*rotation.x/100;

    // mat4.rotateX(
    //     projectionMatrix,
    //     projectionMatrix,
    //     sens*rotation.y/100
    // )
    // mat4.rotateY(
    //     projectionMatrix,
    //     projectionMatrix,
    //     sens*rotation.x/100
    // )



    // mat4.rotateY(
    //     projectionMatrix, // destination matrix
    //     projectionMatrix, // matrix to rotate
    //     rotation.x/100 // amount to rotate in radians
    // ); // axis to rotate around (Z)

    // mat4.rotateX(
    //     projectionMatrix, // destination matrix
    //     projectionMatrix, // matrix to rotate
    //     rotation.y/100 // amount to rotate in radians
    // ); // axis to rotate around (Y)

    // mat4.rotate(
    //     modelViewMatrix, // destination matrix
    //     modelViewMatrix, // matrix to rotate
    //     cubeRotation * 0.3, // amount to rotate in radians
    //     [1, 0, 0],
    // ); // axis to rotate around (X)

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    setPositionAttribute(gl, buffers, programInfo);
    setColorAttribute(gl, buffers, programInfo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix,
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix,
    );


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

function forward(mat) {

}

export { drawScene };