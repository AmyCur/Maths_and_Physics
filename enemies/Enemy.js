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

    constructor(position, scale, rotation, maxSpeed = 0.01, intelligent = true, health = 100, type="ground") {
        this.position=position;
        this.scale=scale;
        this.rotation=rotation;
        this.health=health;
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

        tv.normalized.x *= this.speed;
        tv.normalized.y *= this.speed;
        tv.normalized.z *= this.speed;

        this.position = VectorUtil.ClampPositionInWorld(VectorUtil.Add(this.position, tv.normalized));

        this.position.y=this.type==="fly" ? 5 : -1;
    }

    TargetVector() {
        const cp = this.position;
        const tp = new Vector3(-player.position.x, -player.position.y, -player.position.z);

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