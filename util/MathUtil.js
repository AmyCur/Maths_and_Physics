export class MathUtil {
    "use strict";

    static Deg2Rad=0.01745329252;
    static Rad2Deg=57.2958;

    clamp(f, lower, upper) {
        let nf=f;
        if (nf < lower) nf = lower;
        if (nf > upper) nf = upper;
        return nf;
    }

    lerp(a,b,t){
        if(t>1) t = 1;
        if(t<0) t = 0;
        
        return ((1-t)*a)+(t*b);
    }
}

export const MUtil = new MathUtil();