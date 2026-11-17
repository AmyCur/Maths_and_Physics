import { Vector2 } from "../vectors/Vector2.js";
import { input } from "../input/input.js";

class Camera {

    

    rotation;

    constructor(rotation) {
        this.rotation = rotation;
        this.mousePos = { x: 0, y: 0 };
        this.sensitivityModifier = 300;
        this.Deg2Rad=0.01745329252;
    }

    Add(x, y) {
        this.rotation.x += x;
        this.rotation.y += y;
        
        if(this.rotation.y>90*this.Deg2Rad) this.rotation.y=90*this.Deg2Rad;
        if(this.rotation.y<-90*this.Deg2Rad) this.rotation.y=-90*this.Deg2Rad;
        console.log(this.rotation.y);
    }

    AddListeners(canvas) {
        document.addEventListener("mousemove", (e) => {
            if (!input.GetKey("ShiftLeft")) {
                // const dx = this.mousePos.x - e.clientX;
                // const dy = this.mousePos.y - e.clientY;

                this.Add(-e.movementX / this.sensitivityModifier, -e.movementY / this.sensitivityModifier);

                
            }

            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;

        });
    }
}

export const camera = new Camera(new Vector2(-0.9, 0));