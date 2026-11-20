import { player } from "../game_objects/Player.js";
import { MUtil } from "../util/MathUtil.js";
import { Random } from "../util/Random.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector3 } from "../vectors/Vector3.js";
import { Enemy } from "./Enemy.js";
import { EnemyType } from "./EnemyType.js";
import { Fly } from "./Fly.js";

export class EnemyController {
    types = [
        new EnemyType("fly", 0, 10, 0.3),
        new EnemyType("ground", 200, 5, 0.4)
    ];

    theta = 0;

    GetRandomType() {
        let sumOfWeights = 0;

        for (const v of this.types) {
            // This is the dumbest thing i have ever seen
            sumOfWeights += v.weight;
        }

        const randint = Random.RandInt(0, sumOfWeights);

        sumOfWeights = 0;

        for (const v of this.types) {
            if (randint > sumOfWeights + v.weight) {
                sumOfWeights += v.weight;
            }
            else {
                return v;
            }
        }

    }

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
        const pp = new Vector3(-player.transform.position.x, -player.transform.position.y + 3, -player.transform.position.z);
        return new Vector3(pp.x + (Math.cos(theta) * this.enemySpawnRadius), 0, pp.z + (Math.sin(theta) * this.enemySpawnRadius));
    }

    HandleAI() {
        for (let i = 0; i < this.enemies.length; i++) {
            const enem = this.enemies[i];
            if (enem.intelligent) {

                enem.GetStationary();

                if (enem.stationary) {

                    enem.Attack();

                }
                else {
                    enem.MoveToTargetPositon();
                }
            }
        }
    }

    GetEnemyStats(enemy) {
        const posAroundPlayer = this.GetRandomVectorAroundThePlayer();

        if (enemy.name === "fly") {
            posAroundPlayer.y = 5;
        }


        return {
            pos: posAroundPlayer,
            damage: enemy.damage,
            speed: enemy.speed,
        }
    }

    SpawnEnemy() {
        // const spawnHoard = Random.RandInt(0, 10) === 0;
        let type = this.GetRandomType();
        const spawnHoard = Random.RandInt(0, 10) === 0;
        if (spawnHoard) type = this.types[1];
        const iterations = spawnHoard ? 5 : 1;

        for (let i = 0; i < iterations; i++) {
            const enemyStats = this.GetEnemyStats(type);
            if (type.name === "fly") {
                this.enemies.push(
                    new Enemy(
                        {
                            position: enemyStats.pos,
                            rotation: new Vector3(0, 0, 0),
                            scale: new Vector3(0.8, 1, 0.8),
                        }
                        , enemyStats.speed,
                        true,
                        5,
                        "fly"
                    )
                )
            }
            else {
                this.enemies.push(
                    new Enemy(
                        {
                            position: enemyStats.pos,
                            rotation: new Vector3(0, 0, 0),
                            scale: new Vector3(0.8, 1, 0.8),
                        },
                        enemyStats.speed,
                        true,
                        5,
                        "ground"
                    )
                )
            }
        }







    }
}

export const EController = new EnemyController(20);