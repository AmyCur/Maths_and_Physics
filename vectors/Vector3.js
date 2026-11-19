import { SUtil } from "../util/StringUtil.js";

export class Vector3 {

    constructor(x, y, z) {
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
}