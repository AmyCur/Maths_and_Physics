import { BoxCollider } from "../game_objects/Colliders.js";
import { objects } from "../game_objects/Objects.js";
import { player } from "../game_objects/Player.js";
import { Transform } from "../game_objects/Transform.js";
import { SBPyramid } from "../rendering/BufferData.js";
import { MeshCreator } from "../rendering/Buffers.js";
import { MathUtil } from "../util/MathUtil.js";
import { Random } from "../util/Random.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector3 } from "../vectors/Vector3.js";
import { Enemy } from "./Enemy.js";
import { EnemyType } from "./EnemyType.js";

export class EnemyController {
    "use strict";
    static types = [
        new EnemyType("fly", 0, 10, 0.3),
        new EnemyType("ground", 200, 5, 0.4)
    ];

    static theta = 0;

    static GetRandomType() {
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

    static enemySpawnRadius=0.5;
    static enemySpawnInterval=5;
    

    static GetRandomVectorAroundThePlayer() {
        const theta = (Math.random() * 360) * MathUtil.Deg2Rad;
        const pp = player.transform.position;
        return new Vector3(pp.x + (Math.cos(theta) * this.enemySpawnRadius), pp.y, pp.z + (Math.sin(theta) * this.enemySpawnRadius));
    }

    static HandleAI() {
        for (let i = 0; i < objects.enemies.length; i++) {
            const enem = objects.enemies[i].components.enemy;
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

    static GetEnemyStats(enemy) {
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

    static Update(tick){
        EnemyController.HandleAI();
        if(Math.floor(tick) % this.enemySpawnInterval==0){
            tick=1;
            EnemyController.SpawnEnemy(player.gl);
        }
        return tick;
    }

    static SpawnEnemy() {
        // const spawnHoard = Random.RandInt(0, 10) === 0;
        // let type = this.GetRandomType();
        // const spawnHoard = Random.RandInt(0, 10) === 0;
        // if (spawnHoard) type = this.types[1];
        // const iterations = spawnHoard ? 5 : 1;

        const mesh = EnemyController.CreateEnemyMesh(player.gl, new Enemy());
        objects.enemies.push(mesh);
    }

    static KillAllEnemies(){
        for(let enemy of objects.enemies){
            enemy.components.enemy.Die();
        }
    }

    static CreateEnemyMesh(gl, enemy){
        
        const sp = this.GetRandomVectorAroundThePlayer();
        sp.y=15;

        const buffer = SBPyramid();

        
        const mesh = MeshCreator.CreateMesh(
            gl, 
            buffer, 
            {collider: BoxCollider.default()}, 
            {name: "Jacob", raycastable: true}, 
            Transform.default().SetPosition(VectorUtil.Add(sp, new Vector3(30,0,0))).SetScalef(3,6,3)
        );

        enemy.parent=mesh;
        mesh.components.enemy=enemy;

        return mesh;
    }

}
