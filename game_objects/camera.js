import { Vector2 } from "../vectors/Vector2.js";
import { input } from "../input/input.js";
import { MathUtil, MUtil } from "../util/MathUtil.js";
import { SUtil } from "../util/StringUtil.js";
import { Vector3 } from "../vectors/Vector3.js";

class Camera {
    rotation;

    constructor(rotation) {
        this.rotation = rotation;
        this.sensitivityModifier = 300;
        this.text = document.getElementById("player-rot");
    }



    UpdateUI() {
        this.text.innerHTML = this.rotation.Print(MUtil.Rad2Deg);
    }


    Add(x, y) {
        this.rotation.x += x;
        this.rotation.y += y;

        this.rotation.y = MUtil.clamp(this.rotation.y, -90 * MUtil.Deg2Rad, 90 * MUtil.Deg2Rad);

    }

    LockMouse(canvas) {
        canvas.addEventListener("click", async () => {
            await canvas.requestPointerLock({
                unadjustedMovement: true,
            });
        });
    }

    AddListeners(canvas) {
        document.addEventListener("mousemove", (e) => {
            if (!input.GetKey("ShiftLeft")) {
                this.Add(-e.movementX / this.sensitivityModifier, -e.movementY / this.sensitivityModifier);
            }
        });
    }
}

export const camera = new Camera(new Vector3(-0.9, 0, 0));