import { InitRendering, Render } from "./rendering/rendering.js";
import * as draw from "./rendering/draw-scene.js";
import { input } from "./input/input.js";
import { camera } from "./input/camera.js";
import { Vector2 } from "./vectors/Vector2.js";


function Main() {
    const rendering = InitRendering();
    const gl = rendering.gl;
    const programInfo = rendering.programInfo;
    const buffers = rendering.buffers;

    let then=0;
    let deltaTime=0;

    input.AddListeners();
    camera.AddListeners(gl.canvas);
    
    const playerPos = new Vector2(0,-30);

    function GameLoop(now) {
        //#region Timing
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;
        //#endregion

        Render(gl, programInfo, buffers, playerPos);
        playerPos.Add(input.GetPlayerMovementInput(camera.rotation));

        requestAnimationFrame(GameLoop);
    }

    requestAnimationFrame(GameLoop);
}


Main();