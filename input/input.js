import { Vector2 } from "../vectors/Vector2.js";


class Input{

    keysDown = {
        KeyW: false,
        KeyS: false,
        KeyA: false,
        KeyD: false,
        ShiftLeft: false
    }

    GetKey(code){
        if(this.keysDown.hasOwnProperty(code)) return this.keysDown[code];
        else return false;
    }

    SetKey(code, value){
        this.keysDown[code]=value;
    }

    AddListeners(){
        document.addEventListener("keydown", (e) => {
            this.SetKey(e.code, true);
        });

        document.addEventListener("keyup", (e) => {
            this.SetKey(e.code, false);
        });
    }

    GetPlayerMovementInput(cameraRotationX){
        const forwards = new Vector2(
            Math.sin(cameraRotationX),
            Math.cos(cameraRotationX)
        );
        const backwards = forwards.Invert();
        const right = forwards.Rotate(270);
        const left = right.Invert();
        
        const movementVector = new Vector2(0,0);

        if(this.GetKey("KeyW")) movementVector.Add(forwards);
        if(this.GetKey("KeyS")) movementVector.Add(backwards);
        if(this.GetKey("KeyD")) movementVector.Add(left);
        if(this.GetKey("KeyA")) movementVector.Add(right);
        // if(this.GetKey("Space")) 

        // console.log(movementVector);


        return movementVector.ToVector3();
    }

}



export const input = new Input();