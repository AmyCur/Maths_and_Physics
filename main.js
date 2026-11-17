import { InitRendering, Render } from "./rendering/rendering.js";
import { input } from "./input/input.js";
import { camera } from "./game_objects/camera.js";
import { player } from "./game_objects/Player.js";


function Main() {
    const rendering = InitRendering();
    const gl = rendering.gl;
    const programInfo = rendering.programInfo;
    const buffers = rendering.buffers;

    let then=0;
    let deltaTime=0;

    camera.LockMouse(gl.canvas);
    input.AddListeners();
    camera.AddListeners(gl.canvas);

    function GameLoop(now) {
        //#region Timing
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;
        //#endregion

        Render(gl, programInfo, buffers);
        player.position.Add(input.GetPlayerMovementInput(camera.rotation.x));
        player.Gravity();
        if(input.GetKey("Space") && (player.Grounded() || player.jumping)) player.Jump();


        requestAnimationFrame(GameLoop);
    }

    requestAnimationFrame(GameLoop);
}


Main();