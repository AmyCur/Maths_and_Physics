export class MathUtil {
    constructor() { 
        this.Deg2Rad=0.01745329252;
    }

    clamp(v, lower, upper) {
        let nv=v;
        if (nv < lower) nv = lower;
        if (nv > upper) nv = upper;
        return nv;
    }
}

export const MUtil = new MathUtil();