import { BoxCollider, ColliderUtils } from "../game_objects/Colliders.js";
import { Entity } from "../game_objects/Entity.js";
import { objects } from "../game_objects/Objects.js";
import { player } from "../game_objects/Player.js";
import { TransObject } from "../game_objects/TransObject.js";
import { Attack } from "../input/Attack.js";
import { MathUtil, MUtil } from "../util/MathUtil.js";
import { Time } from "../util/Time.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector3 } from "../vectors/Vector3.js";
import { EController } from "./EnemyManager.js";

export class Enemy {
    "use strict";
    maxSpeed;
    speed=0.01;
    type;
    dead =false;
    parent=null;

    constructor(maxSpeed = 1, intelligent = true, health = 1, type="ground") {
        
        // this.health=health;
        this.maxSpeed = maxSpeed;
        this.intelligent = true;
        this.stoppingDistance = 6;
        this.health=health;
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
        console.log(damage);
        this.health -= damage;
        console.log(this.health);
        if (this.health <= 0) this.Die();
    }

    Die() {
        console.log("dead");
        this.dead=true;
        objects.RemoveItemFromArray(this.parent, objects.enemies);
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
        
        this.parent.transform.position.y=this.type==="fly" ? 10 : 5;

        const cp = this.parent.transform.position;
        
        
        this.parent.transform.position = ColliderUtils.MoveWithRespect(cp, tv.normalized);

        
    }

    TargetVector() {
        const cp = this.parent.transform.position;
        const tp = new Vector3(player.transform.position.x, player.transform.position.y, player.transform.position.z);

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