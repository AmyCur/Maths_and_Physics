import { InitRendering, Render } from "./rendering/rendering.js";
import { input } from "./input/input.js";
import { camera } from "./game_objects/camera.js";
import { player } from "./game_objects/Player.js";
import { Time } from "./util/Time.js";
import { EController, EnemyController } from "./enemies/EnemyController.js";


function Main() {
    const rendering = InitRendering();
    const gl = rendering.gl;
    const programInfo = rendering.programInfo;
    const buffers = rendering.buffers;

    const enemySpawnInterval = 5;

    const enemies = []

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

        if(Math.floor(tick)%enemySpawnInterval==0){
            tick=1;
            console.log("spawning");
            EController.SpawnEnemy();
        }

        EController.HandleAI();
        player.position.Add(input.GetPlayerMovementInput());
        player.Gravity();
        player.UpdateUI();
        camera.UpdateUI();

        Render(gl, programInfo, buffers);
       
        
        if(input.GetKey("Space") && (player.Grounded() || player.jumping)) player.Jump();

        requestAnimationFrame(GameLoop);
    }

    requestAnimationFrame(GameLoop);
}


Main();