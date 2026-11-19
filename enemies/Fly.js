import { Entity } from "../game_objects/Entity.js";
import { GameObject } from "../game_objects/GameObject.js";
import { player } from "../game_objects/Player.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector3 } from "../vectors/Vector3.js";
import { Enemy } from "./Enemy.js";

class Fly  {
    TargetVector() {
        const cp = this.position;
        const tp = new Vector3(-player.transform.position.x, -5, -player.transform.position.z);

        const difference = VectorUtil.Subtract(tp, cp);

        const differenceLength = difference.Length();

        const normal = VectorUtil.Normalize(difference);

        return {
            normalized: normal,
            length: differenceLength
        };
    }

    // constructor(position, rotation , scale, maxSpeed = 0.01, intelligent = true, health = 100) {
    //     super(position, rotation, scale, maxSpeed, intelligent, health);
    // }
}

export { Fly };