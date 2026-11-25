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
import { MedKit } from "./game_objects/MedKit.js";  


function Main() {
    const rendering = InitRendering();
    const gl = rendering.gl;
    const programInfo = rendering.programInfo;
    
    MedKit.CreateNewMedKit(gl);

    const enemySpawnInterval = 5;
    
    let then=0;
    let tick=0;
    
    input.AddListeners();
    camera.AddListeners(gl.canvas);
    camera.LockMouse(gl.canvas);

    function CalculateDeltaTime(now){
        now *= 0.001;
        Time.deltaTime = now - then;
        then = now;
        tick+=Time.deltaTime;
    }


    function GlobalUpdate(now) {
        //#region Timing
        
        CalculateDeltaTime(now);
        //#endregion

        // EnemyManager.Update(gl, tick, enemySpawnInterval);

        EController.HandleAI();

        if(input.GetKey("Mouse")) player.Attack();
        if(input.GetKey("KeyK")) {
            for(let enem of objects.mesh.enemies){
                enem.components.enemy.Die();
            }
        }

        player.Update();
        objects.MoveAllObjects(gl);

        UIManager.UpdateUI();

        EController.theta++;

        Render(gl, programInfo);
       

        requestAnimationFrame(GlobalUpdate);
    }

    requestAnimationFrame(GlobalUpdate);
}


Main();