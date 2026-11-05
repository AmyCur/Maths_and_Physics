import { GetIdentityMatrix, GetPerspectiveMatrix } from "./matricies.js";
import * as setting from "./settings.js";



function DrawScreen(gl){
    ClearScreen(gl);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    const aspectRatio = gl.canvas.clientWidth/gl.canvas.clientHeight;
    const fov = (setting.fov*Math.PI)/180;
    const projectionMatrix = GetPerspectiveMatrix(fov, aspectRatio, setting.nearPlaneDistance, setting.farPlaneDistance);
    console.log(projectionMatrix);
        
    
    
}

function ClearScreen(gl) {
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export {ClearScreen, DrawScreen}