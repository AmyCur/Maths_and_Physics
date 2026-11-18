import { SUtil } from "../util/StringUtil.js";
import { Vector } from "./Vector.js";

export class Vector3 extends Vector {

    constructor(x, y, z) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }

    Print(v, mult = 1) {
        const x = SUtil.TruncateComponent(this.x * mult);
        const y = SUtil.TruncateComponent(this.y * mult);
        const z = SUtil.TruncateComponent(this.z * mult);
        return `X: ${x}, Y: ${y}, Z: ${z}`;
    }

    Length() {
        return (
            Math.sqrt(
                (this.x * this.x) +
                (this.y * this.y) +
                (this.z * this.z)
            )
        )
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

    AddAndReturn(v1, v2) {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }


    Add(v) {
        this.Set(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    Subtract(v) {
        this.Set(this.x - v.x, this.y - v.y, this.z - v.z);
    }
}