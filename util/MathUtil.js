export class MathUtil {
    constructor() { 
        this.Deg2Rad=0.01745329252;
        this.Rad2Deg=57.2958;
    }

    clamp(v, lower, upper) {
        let nv=v;
        if (nv < lower) nv = lower;
        if (nv > upper) nv = upper;
        return nv;
    }

    lerp(a,b,t){
        if(t>1) t = 1;
        if(t<0) t = 0;
        
        return ((1-t)*a)+(t*b);
    }
}

export const MUtil = new MathUtil();