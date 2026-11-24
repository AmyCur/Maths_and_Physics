import { BoxCollider, ColliderUtils } from "../game_objects/Colliders.js";
import { objects } from "../game_objects/Objects.js";
import { player } from "../game_objects/Player.js";
import { Transform } from "../game_objects/Transform.js";
import { Buffer } from "../rendering/Buffer.js";
import { MeshCreator } from "../rendering/BufferManager.js";
import { textures } from "../rendering/Textures.js";
import { MathUtil, MUtil } from "../util/MathUtil.js";
import { Random } from "../util/Random.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector3 } from "../vectors/Vector3.js";
import { Enemy } from "./Enemy.js";
import { EnemyType } from "./EnemyType.js";

export class EnemyManager {
    "use strict";
    types = [
        new EnemyType("fly", 300, 10, 0.3),
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

    static enemySpawnRadius=30;

    constructor() {
        this.enemies = [];

        // if(enemies.length>0){
        //     for(const e in enemies){
        //         this.SpawnEnemy(e);
        //     }
        // }
    }

    static GetRandomVectorAroundThePlayer() {
        const theta = MUtil.clamp((Math.random() * 360) * MathUtil.Deg2Rad, 3, 8);
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

        const mesh = EnemyManager.CreateEnemyMesh(player.gl, new Enemy());
        objects.enemies.push(mesh);
    }

    static CreateEnemyMesh(gl, enemy){
        
        let sp = this.GetRandomVectorAroundThePlayer();
        
        for(let i = 0; i < 100; i++){
            if(!ColliderUtils.IsColliding(sp, Vector3.zero())) break;
            sp = this.GetRandomVectorAroundThePlayer();
        }
        console.log(sp);
        console.log(sp)
        sp.y=15;

        
        const mesh = MeshCreator.CreateMesh(
            gl, 
            Buffer.default(), 
            {collider: BoxCollider.default()}, 
            {name: "Jacob", raycastable: true, texture: textures.loadTexture(gl, textures.paths.tung)}, 
            Transform.default().SetPosition(VectorUtil.Add(sp, new Vector3(30,0,0))).SetScalef(3,6,3)
        );

        enemy.parent=mesh;
        mesh.components.enemy=enemy;

        return mesh;
    }

    
}

export const EController = new EnemyManager(20);