import { Vector } from "./Vector.js";

export class Vector3 extends Vector{ 

    constructor(x, y, z) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
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
}