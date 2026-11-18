import { camera } from "../game_objects/camera.js";
import { player } from "../game_objects/Player.js";
import { Vector2 } from "../vectors/Vector2.js";


class Input {

    keysDown = {
        KeyW: false,
        KeyS: false,
        KeyA: false,
        KeyD: false,
        KeyK: false,
        ShiftLeft: false,
        ControlLeft: false,
        Mouse: false
    }

    movementDirectionVector = new Vector2(0, 0);
    restingDirectionVector = new Vector2(0, 0);

    forwards(cameraRotationX) {
        return new Vector2(
            Math.sin(cameraRotationX),
            Math.cos(cameraRotationX)
        );
    }

    angle = 0;

    GetKey(code) {
        if (this.keysDown.hasOwnProperty(code)) return this.keysDown[code];
        else return false;
    }

    SetKey(code, value) {
        this.keysDown[code] = value;
    }

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

    GetPlayerMovementInput() {
        const forwards = this.forwards(camera.rotation.x);

        const backwards = forwards.Invert();
        const right = forwards.Rotate(270);
        const left = right.Invert();

        const movementVector = new Vector2(0, 0);
        this.movementDirectionVector = new Vector2(0, 0);

        if (this.GetKey("KeyW")) {
            this.movementDirectionVector.y += 1;
            movementVector.Add(forwards);
        }
        if (this.GetKey("KeyS")) {
            this.movementDirectionVector.y -= 1;

            movementVector.Add(backwards);
        }
        if (this.GetKey("KeyD")) {
            this.movementDirectionVector.x += 1;
            movementVector.Add(left);
        }
        if (this.GetKey("KeyA")) {
            this.movementDirectionVector.x -= 1;
            movementVector.Add(right);
        }

        if(this.movementDirectionVector.x!==0 && this.movementDirectionVector.y!==0) this.restingDirectionVector=this.movementDirectionVector; 

        if ((movementVector.x != 0 || movementVector.y != 0) && player.Grounded()) this.angle += 0.5;
        if (!player.Grounded()) this.angle = 0;
        // if(this.GetKey("Space")) 

        // console.log(movementVector);


        return movementVector.ToVector3();
    }

}



export const input = new Input();