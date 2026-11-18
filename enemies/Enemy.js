import { player } from "../game_objects/Player.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector3 } from "../vectors/Vector3.js";

export class Enemy {

    position;
    rotation;
    scale;
    speed;

    constructor(position, rotation, scale, speed = 0.01) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.speed = speed;
    }

    MoveToTargetPositon() {
        const tv = this.TargetVector();
        console.log(tv);
        tv.x*=this.speed;
        tv.y*=this.speed;
        tv.z*=-this.speed;



        this.position.Add(tv);
    }

    TargetVector(){
        const cp = this.position;
        const tp = player.position;

        const difference = VectorUtil.Subtract(tp,cp);

        const normal = VectorUtil.Normalize(difference);
        
        return normal;
    }
}