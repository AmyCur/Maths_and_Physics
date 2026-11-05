function InitBuffers(gl){
    const positionBuffer = InitPositionBuffer(gl);

    return {
        positionBuffer: positionBuffer
    }
}

function InitPositionBuffer(gl){
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    return buffer;
}

export {InitBuffers};