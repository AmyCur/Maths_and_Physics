import { Vector2 } from "../vectors/Vector2.js";

class Camera{
    
    rotation;

    constructor(rotation){
        this.rotation=rotation;
        this.deltaMouse = {x: 0, y: 0};
        this.currentMouse = {x: 0, y: 0};
    }

    Add(x,y){
        this.rotation.x+=x;
        this.rotation.y+=y;
    }

    AddListeners(){
        document.addEventListener("mousemove", (e) => {
            this.deltaMouse= {x: e.clientX,y : e.clientY};
            // this.currentMouse= {x: this.currentMouse.x -this.deltaMouse.x, y: this.currentMouse.y-this.deltaMouse.y};
            

            this.Add(this.currentMouse.x/10000, this.currentMouse.y/10000);
        });
    }
}

export const camera = new Camera(new Vector2(0,0));