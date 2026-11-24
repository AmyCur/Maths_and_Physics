import { InitRendering, Render } from "./rendering/RenderManager.js";
import { input } from "./input/input.js";
import { camera } from "./game_objects/camera.js";
import { player } from "./game_objects/Player.js";
import { Time } from "./util/Time.js";
import { EController, EnemyManager } from "./enemies/EnemyManager.js";
import { VectorUtil } from "./util/VectorUtil.js";
import { objects } from "./game_objects/Objects.js";
import { Vector3 } from "./vectors/Vector3.js";
import { UIManager } from "./UI/UIManager.js";


function Main() {
    const rendering = InitRendering();
    const gl = rendering.gl;
    const programInfo = rendering.programInfo;


    const enemySpawnInterval = 5;
    
    let then=0;
    let tick=0;
    
    input.AddListeners();
    camera.AddListeners(gl.canvas);
    camera.LockMouse(gl.canvas);

    player.CreateGun(gl);

    function GameLoop(now) {
        //#region Timing
        now *= 0.001; // convert to seconds
        Time.deltaTime = now - then;
        then = now;
        tick+=Time.deltaTime;

        //#endregion

        if(Math.floor(tick)%enemySpawnInterval==0){
            tick=1;
            EnemyManager.SpawnEnemy(gl);
        }

        EController.HandleAI();

        if(input.GetKey("Mouse")) player.Attack();
        if(input.GetKey("KeyK")) {
            for(let enem of objects.enemies){
                enem.components.enemy.Die();
            }
        }

        player.Update();

        UIManager.UpdateUI();

        EController.theta++;

        Render(gl, programInfo);
       

        requestAnimationFrame(GameLoop);
    }

    requestAnimationFrame(GameLoop);
}


Main();