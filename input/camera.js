import { Vector2 } from "../vectors/Vector2.js";
import { input } from "./input.js";

class Camera {

    rotation;



    constructor(rotation) {
        this.rotation = rotation;
        this.mousePos = { x: 0, y: 0 };
        this.sensitivityModifier = 300;
    }

    Add(x, y) {
        this.rotation.x += x;
        this.rotation.y += y;
    }

    AddListeners(canvas) {
        document.addEventListener("mousemove", (e) => {
            if (!input.GetKey("ShiftLeft")) {
                const dx = this.mousePos.x - e.clientX;
                const dy = this.mousePos.y - e.clientY;

                this.Add(dx / this.sensitivityModifier, dy / this.sensitivityModifier);

                
            }

            this.mousePos.x = e.clientX;
                this.mousePos.y = e.clientY;

        });
    }
}

export const camera = new Camera(new Vector2(-0.9, 0));