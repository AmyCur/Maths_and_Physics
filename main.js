import { InitRendering, Render } from "./rendering/Rendering.js";
import { input } from "./input/input.js";
import { camera } from "./game_objects/camera.js";
import { player } from "./game_objects/Player.js";
import { Time } from "./util/Time.js";
import { EnemyController } from "./enemies/EnemyController.js";
import { VectorUtil } from "./util/VectorUtil.js";
import { objects } from "./game_objects/Objects.js";
import { Vector3 } from "./vectors/Vector3.js";
import { UIManager } from "./UI/UIManager.js";


function Main() {
    const rendering = InitRendering();
    const gl = rendering.gl;
    const programInfo = rendering.programInfo;
    
    let then=0;
    let tick=0;
    
    input.AddListeners();
    camera.AddListeners(gl.canvas);
    camera.LockMouse(gl.canvas);

    function GameLoop(now) {
        //#region Timing
        now *= 0.001; // convert to seconds
        Time.deltaTime = now - then;
        then = now;
        tick+=Time.deltaTime;

        //#endregion

        tick = EnemyController.Update(tick);

        // EController.HandleAI();

        input.Update();
        player.Update();
        UIManager.UpdateUI();

        EnemyController.theta++;

        Render(gl, programInfo);

        requestAnimationFrame(GameLoop);
    }

    requestAnimationFrame(GameLoop);
}


Main();