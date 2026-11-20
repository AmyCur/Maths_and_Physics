import { Entity } from "../game_objects/Entity.js";
import { player } from "../game_objects/Player.js";
import { Attack } from "../input/Attack.js";
import { MathUtil, MUtil } from "../util/MathUtil.js";
import { Time } from "../util/Time.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector3 } from "../vectors/Vector3.js";
import { EController } from "./EnemyController.js";

export class Enemy {
    maxSpeed;
    speed;
    type;

    constructor(transform, maxSpeed = 0.01, intelligent = true, health = 100, type="ground") {
        
        this.transform = transform;

        // this.health=health;
        this.maxSpeed = maxSpeed;
        this.intelligent = intelligent;
        this.stoppingDistance = 6;
        this.forceStopDistance = 3;

        this.attack = new Attack(1, 10, () => {
            player.TakeDamage(this.attack.damage);
            this.attack.Cooldown();
        });

        this.type = type;
    }

    CalculateSpeed(tv) {
        if (tv.length <= this.forceStopDistance) return 0;
        return MUtil.lerp(0, this.maxSpeed, tv.length / 20);
    }

    GetStationary() {
        const tv = this.TargetVector(this.overrideY);
        this.stationary = tv.length <= this.forceStopDistance;
    }

    TakeDamage(damage) {
        console.log("taken damage");
        this.health -= damage;
        console.log(this.health);
        if (this.health <= 0) this.Die();
    }

    Die() {
        console.log("dead");
        EController.enemies.pop(this);
    }

    Attack() {
        this.attack.CheckCD();
    }


    MoveToTargetPositon() {
        const tv = this.TargetVector(this.overrideY);

        this.speed = this.CalculateSpeed(tv);

        tv.normalized = new Vector3(
            tv.normalized.x,
            tv.normalized.y,
            tv.normalized.z
        )

        tv.normalized.x *= this.speed;
        tv.normalized.y *= this.speed;
        tv.normalized.z *= this.speed;
        
        this.transform.position.y=this.type==="fly" ? 5 : -1;
        
        this.transform.position = VectorUtil.ClampPositionInWorld(this.transform.position, tv.normalized, true);

        
    }

    TargetVector() {
        const cp = this.transform.position;
        const tp = new Vector3(-player.transform.position.x, -player.transform.position.y, -player.transform.position.z);

        const difference = VectorUtil.Subtract(tp, cp);

        if(this.type==="fly") difference.y=0;

        const differenceLength = VectorUtil.GetLength(difference);

        const normal = VectorUtil.Normalize(difference);

        return {
            normalized: normal,
            length: differenceLength
        };
    }
}