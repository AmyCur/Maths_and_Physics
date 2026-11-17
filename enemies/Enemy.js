import { player } from "../game_objects/Player.js";

export class Enemy {

    constructor(position, rotation, scale, speed = 0.01) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.speed = speed;
    }

    MoveToTargetPositon() {
        console.log(`going to ${this.TargetVector()}`)
        this.position.Add(this.TargetVector().MultiplyScalar(0.01))
    }

    TargetVector(){
        const position = this.position;
        position.Subtract(this.TargetPosition());
        return position.Normalize();
    }

    TargetPosition() {
        return player.position;
    }


}