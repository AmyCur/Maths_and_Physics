import { GetIdentityMatrix, GetPerspectiveMatrix, TranslateMatrix } from "./matricies.js";
import * as setting from "./settings.js";



function DrawScreen(gl, buffers, programInfo) {
    ClearScreen(gl);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const fov = (setting.fov * Math.PI) / 180;
    const projectionMatrix = GetPerspectiveMatrix(fov, aspectRatio, setting.nearPlaneDistance, setting.farPlaneDistance);
    let modelViewMatrix = GetIdentityMatrix();
    modelViewMatrix = TranslateMatrix(modelViewMatrix, { x: 0, y: 0, z: -6 });

    setPositionAttribute(gl, buffers, programInfo)

    gl.useProgram(programInfo.program);

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

    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }


}

function setPositionAttribute(gl, buffers, programInfo) {
    const numComponents = 2; // pull out 2 values per iteration
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



function ClearScreen(gl) {
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export { ClearScreen, DrawScreen }