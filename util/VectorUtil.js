import { Vector3 } from "../vectors/Vector3.js";
import { SUtil } from "./StringUtil.js";

export const VectorUtil = {
    Print(v, mult = 1) {
        const x = SUtil.TruncateComponent(v.x * mult);
        const y = SUtil.TruncateComponent(v.y * mult);
        const z = SUtil.TruncateComponent(v.z * mult);
        return `X: ${x}, Y: ${y}, Z: ${z}`;
    },

    Subtract(v1, v2) {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    },

    Multiply(v1, f) {
        const nx = v1.x * f;
        const ny = v1.y * f;
        const nz = v1.z * f;

        return new Vector3(nx, ny, nz);
    },

    WithinRange(v, min, max) {
        const xInRange = v.x >= min.x && v.x <= max.x;
        const yInRange = v.y >= min.y && v.y <= max.y;
        const zInRange = v.z >= min.z && v.z <= max.z;

        return xInRange && yInRange && zInRange;
    },

    Add(v1, v2) {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    },

    GetLength(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    },

    GetVectorFromAngles(alpha, beta) {


        const x = Math.cos(alpha) * Math.cos(beta);
        const z = Math.sin(alpha) * Math.cos(beta);
        const y = Math.sin(beta);

        let attackDir = new Vector3(x,y,z);

        return this.Normalize(attackDir);
    },

    Normalize(v) {
        if (v.x === 0 && v.y === 0 && v.z === 0) return new Vector3(0, 0, 0);
        const len = this.GetLength(v);
        return this.Multiply(v, 1 / len);
    },

    IsZero(v) {
        return v.x === 0 && v.y === 0 && v.z === 0;
    }
}