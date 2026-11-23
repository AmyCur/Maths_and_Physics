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

class Camera extends TransObject {

    constructor(cameraData) {
        super(cameraData.transform, {}, {})

        this.fov = cameraData.fov;

        this.canvas = cameraData.canvas;

        this.screenWidth = this.canvas.clientWidth;
        this.screenHeight = this.canvas.clientHeight;
        this.aspectRatio = this.screenHeight / this.screenHeight;
        this.zNear = cameraData.zNear;
        this.zFar = cameraData.zFar;

    }

    ClampRotation() {
        this.transform.rotation.y = MUtil.clamp(this.transform.rotation.y, -90 * MathUtil.Deg2Rad, 90 * MathUtil.Deg2Rad);
    }


    Rotate(x, y) {
        this.transform.rotation.x += x;
        this.transform.rotation.y += y;

        this.ClampRotation();
    }

    LockMouse(canvas) {
        canvas.addEventListener("mousedown", async () => {
            await canvas.requestPointerLock({
                unadjustedMovement: true,
            });
        });
    }

    GetInvertedCameraPosition() {
        return VectorUtil.Invert(this.GetCameraPosition());
    }

    GetCameraPosition() {
        return VectorUtil.Add(player.transform.position, camera.transform.position)
    }

    AddListeners(canvas) {
        document.addEventListener("mousemove", (e) => {
            if (!input.GetKey("ControlLeft")) {
                this.Rotate(-e.movementX / 300, -e.movementY / 300);
            }
        });
    }
}

export const camera = new Camera({
    transform: {
        position: new Vector3(0, 10, 0),
        rotation: new Vector3(0, -2, 0),
        scale: new Vector3(1, 1, 1),
    },
    fov: 45,
    canvas: document.getElementById("gl-canvas"),
    zNear: 0.1,
    zFar: 1000
});