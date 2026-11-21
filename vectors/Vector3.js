"use strict";

import { MathUtil } from "../util/MathUtil.js";
import { SUtil } from "../util/StringUtil.js";

export class Vector3 {
    static zero = () => new Vector3(0,0,0);
    static one = () => new Vector3(1,1,1);

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

    Rotate(angle) {
        angle *= MathUtil.Deg2Rad;
        const nx = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
        const ny = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));

        return new Vector3(nx, ny, 0);
    }
}