import { BoxCollider } from "../game_objects/Colliders.js";
import { Mesh } from "../game_objects/Mesh.js";
import { objects } from "../game_objects/Objects.js";
import { player } from "../game_objects/Player.js";
import { Transform } from "../game_objects/Transform.js";
import { Buffer } from "../rendering/Buffer.js";
import { MeshCreator } from "../rendering/init-buffers.js";
import { MathUtil, MUtil } from "../util/MathUtil.js";
import { Random } from "../util/Random.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector3 } from "../vectors/Vector3.js";
import { Enemy } from "./Enemy.js";
import { EnemyType } from "./EnemyType.js";
import { Fly } from "./Fly.js";

export class EnemyController {
    "use strict";
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

    static enemySpawnRadius=0.5;

    constructor() {
        this.enemies = [];

        // if(enemies.length>0){
        //     for(const e in enemies){
        //         this.SpawnEnemy(e);
        //     }
        // }
    }

    static GetRandomVectorAroundThePlayer() {
        const theta = (Math.random() * 360) * MathUtil.Deg2Rad;
        const pp = player.transform.position;
        return new Vector3(pp.x + (Math.cos(theta) * this.enemySpawnRadius), pp.y, pp.z + (Math.sin(theta) * this.enemySpawnRadius));
    }

    HandleAI() {
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

    static SpawnEnemy() {
        // const spawnHoard = Random.RandInt(0, 10) === 0;
        // let type = this.GetRandomType();
        // const spawnHoard = Random.RandInt(0, 10) === 0;
        // if (spawnHoard) type = this.types[1];
        // const iterations = spawnHoard ? 5 : 1;

        const mesh = EnemyController.CreateEnemyMesh(player.gl, new Enemy());
        objects.enemies.push(mesh);
    }

    static CreateEnemyMesh(gl, enemy){
        
        const sp = this.GetRandomVectorAroundThePlayer();
        console.log(sp)
        sp.y=15;

        const buffer = Buffer.default();
      
        
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

    static CreateEnemyMeshs(gl) {

        // Get the currently alive enemies
        return objects.enemies;
        const enemyMeshs = [];

        // Go through them
        for(let i = 0; i < ae.length; i++){
            enemyMeshs.push(ae[i]);
        }

        // objects.enemies = [];
    
        // for (let i = 0; i < EController.enemies.length; i++) {
        //     const enemy = EController.enemies[i];
        //     const buffer = Buffer.default();
        //     buffer.color = Mesh.GetColor("red");
            
        //     const eMesh = MeshCreator.CreateMesh(gl, buffer, { enemy: enemy, collider: BoxCollider.default() });
    
        //     eMesh.transform.position = enemy.transform.position;
        //     eMesh.transform.scale = enemy.transform.scale;
        //     eMesh.transform.rotation = enemy.transform.rotation;
    
        //     // eb.components.collider = new BoxCollider(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
        //     eMesh.properties.name = "enemy";
    
    
        //     objects.enemies.push(eMesh);
        //     enemyMeshs.push(eMesh);
        // }
    
        return enemyMeshs;
    }
}

export const EController = new EnemyController(20);