import { camera } from "../game_objects/camera.js";
import { player } from "../game_objects/Player.js";
import { Vector2 } from "../vectors/Vector2.js";
import { Vector3 } from "../vectors/Vector3.js";

export const input = {

    keysDown: {
        KeyW: false,
        KeyS: false,
        KeyA: false,
        KeyD: false,
        KeyK: false,
        ShiftLeft: false,
        ControlLeft: false,
        Mouse: false
    },


    forwards(cameraRotationX) {
        return new Vector3(
            Math.sin(cameraRotationX),
            Math.cos(cameraRotationX),
            0
        );
    },

    angle: 0,

    GetKey(code) {
        if (this.keysDown.hasOwnProperty(code)) return this.keysDown[code];
        else return false;
    },

    SetKey(code, value) {
        this.keysDown[code] = value;
    },

    AddListeners() {
        document.addEventListener("keydown", (e) => {
            this.SetKey(e.code, true);
        });

        document.addEventListener("keyup", (e) => {
            this.SetKey(e.code, false);
        });

        document.addEventListener("mousedown", (e) => {
            this.SetKey("Mouse", true);
        })

        document.addEventListener("mouseup", (e) => {
            this.SetKey("Mouse", false);
        })
    }



}