import { player } from "../game_objects/Player.js";
import { MUtil } from "../util/MathUtil.js";
import { Vector3 } from "../vectors/Vector3.js";
import { Enemy } from "./Enemy.js";

export class EnemyController {


    constructor(enemySpawnRadius = 5) {
        this.enemySpawnRadius = enemySpawnRadius;
        this.enemies = [];

        // if(enemies.length>0){
        //     for(const e in enemies){
        //         this.SpawnEnemy(e);
        //     }
        // }
    }

    GetRandomVectorAroundThePlayer() {
        const theta = (Math.random() * 360) * MUtil.Deg2Rad;
        const pp = player.position;
        return new Vector3(pp.x + (Math.cos(theta) * this.enemySpawnRadius), pp.y, pp.z + (Math.sin(theta) * this.enemySpawnRadius));
    }

    HandleAI() {
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].MoveToTargetPositon();
        }
    }

    SpawnEnemy() {
        if(this.enemies.length<=0)
        this.enemies.push(
            new Enemy(
                this.GetRandomVectorAroundThePlayer(),
                new Vector3(0, 0, 0),
                new Vector3(1, 1, 1),
                0.5
            )
        )
    }
}

export const EController = new EnemyController(5);