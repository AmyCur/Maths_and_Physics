import { Entity } from "../game_objects/Entity.js";
import { player } from "../game_objects/Player.js";
import { Attack } from "../input/Attack.js";
import { MathUtil, MUtil } from "../util/MathUtil.js";
import { Time } from "../util/Time.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector3 } from "../vectors/Vector3.js";

export class Enemy extends Entity{
    maxSpeed;
    speed;

    constructor(position, rotation, scale, maxSpeed = 0.01, intelligent=true, health=10) {
        super(position,scale,rotation,health);
        this.maxSpeed = maxSpeed;
        this.intelligent=intelligent;
        this.stoppingDistance=6;
        this.forceStopDistance=3;
        this.attack = new Attack(1, 10);
    }

    CalculateSpeed(tv){
        if(tv.length<=this.forceStopDistance) return 0;
        return MUtil.lerp(0, this.maxSpeed, tv.length/20);
    }

    GetStationary(){
        const tv = this.TargetVector();
        this.stationary = tv.length<=this.forceStopDistance;
    }

    Attack(){
        if(this.attack.onCD) this.attack.CheckCD();
        else {
            player.TakeDamage(this.attack.damage);
            this.attack.Cooldown();
        }
    }


    MoveToTargetPositon() {
        const tv = this.TargetVector();

        this.speed=this.CalculateSpeed(tv);

        tv.normalized.x*=this.speed;
        tv.normalized.y*=this.speed;
        tv.normalized.z*=this.speed;

        
       this.position.Add(tv.normalized);
    }

    TargetVector(){
        const cp = this.position;
        const tp = new Vector3(-player.position.x,-player.position.y,-player.position.z);

        const difference = VectorUtil.Subtract(tp,cp);

        const differenceLength = difference.Length();

        const normal = VectorUtil.Normalize(difference);
        
        return {
            normalized : normal,
            length: differenceLength
        };
    }
}