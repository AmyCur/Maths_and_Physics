import { Vector2 } from "../vectors/Vector2.js";
import { input } from "../input/input.js";
import { MathUtil, MUtil } from "../util/MathUtil.js";
import { SUtil } from "../util/StringUtil.js";
import { Vector3 } from "../vectors/Vector3.js";
import { GameObject } from "./GameObject.js";
import { TransObject } from "./TransObject.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { player } from "./Player.js";
"use strict";

class Camera extends TransObject{


    sensitivityModifier;
    text;

    constructor(transform) {
        super(transform, {}, {})
        this.sensitivityModifier = 300;
    }

    Add(x, y) {
        this.transform.rotation.x += x;
        this.transform.rotation.y += y;

        this.transform.rotation.y = MUtil.clamp(this.transform.rotation.y, -90 * MathUtil.Deg2Rad, 90 * MathUtil.Deg2Rad);
    }

    LockMouse(canvas) {
        canvas.addEventListener("click", async () => {
            await canvas.requestPointerLock({
                unadjustedMovement: true,
            });
        });
    }

    GetInvertedCameraPosition(){
        return VectorUtil.Invert(this.GetCameraPosition());
    }

    GetCameraPosition(){
        return VectorUtil.Add(player.transform.position, camera.transform.position)
    }

    AddListeners(canvas) {
        document.addEventListener("mousemove", (e) => {
            if (!input.GetKey("ControlLeft")) {
                this.Add(-e.movementX / this.sensitivityModifier, -e.movementY / this.sensitivityModifier);
            }
        });
    }
}

export const camera = new Camera({
    position: new Vector3(0,10,0),
    rotation: new Vector3(0,0,0),
    scale: new Vector3(1,1,1),
});