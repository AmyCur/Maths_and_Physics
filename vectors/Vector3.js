import { SUtil } from "../util/StringUtil.js";
import { Vector } from "./Vector.js";

export class Vector3 extends Vector{ 

    constructor(x, y, z) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }

    Print(mult=1){
        const x = SUtil.TruncateComponent(this.x*mult);
        const y = SUtil.TruncateComponent(this.y*mult);
        const z = SUtil.TruncateComponent(this.z*mult);
        return `X: ${x}, Y: ${y}, Z: ${z}`;
    }

    Normalize(){
        const v3 = new Vector3(this.x,this.y,this.z);
        const l = Math.sqrt(
            ((v3.x*v3.x)+(v3.y*v3.y)+(v3.z*v3.z))
        );
        return new Vector3(v3.x/l,v3.y/l,v3.z/l);
    }

    MultiplyScalar(f) {
        const nx = this.x * f;
        const ny = this.y * f;
        const nz = this.z * f;

        return new Vector3(nx, ny, nz);
    }

    Invert() {
        return new Vector3(this.x * -1, this.y * -1, this.z * -1);
    }

    Set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }


    Add(v) {
        this.Set(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    Subtract(v){
        this.Set(this.x - v.x, this.y - v.y, this.z - v.z);  
    }
}