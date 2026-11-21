import { MUtil } from "../util/MathUtil.js";
import { Vector3 } from "./Vector3.js";

//TODO What is the point in this? Should remove at some point
export class Vector2{
    "use strict";
    x;
    y;

    

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    MultiplyScalar(f) {
        const nx = this.x * f;
        const ny = this.y * f;

        return new Vector2(nx, ny);
    }

    ToVector3(){
        return new Vector3(this.x,0,this.y);
    }

    Invert() {
        return new Vector2(this.x * -1, this.y * -1);
    }

    Set(x, y) {
        this.x = x;
        this.y = y;
    }


    Add(v) {
        this.Set(this.x + v.x, this.y + v.y)
    }

    Rotate(angle) {
        angle*=MUtil.Deg2Rad;
        const nx = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
        const ny = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));

        return new Vector2(nx, ny);
    }
}