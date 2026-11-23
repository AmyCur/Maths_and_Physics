"use strict";

import { MathUtil } from "../util/MathUtil.js";
import { SUtil } from "../util/StringUtil.js";

export class Vector3 {
    static zero = () => new Vector3(0,0,0);
    static one = () => new Vector3(1,1,1);
    static down = () => new Vector3(0,-1,0);
    static up = () => new Vector3(0,1,0);
    

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

    ToArray(){
        return [this.x, this.y, this.z];
    }

    Dividef(f){

        if(f===0){
            console.error("Divide by zero error");
            return this;
        }

        const nv = this;
        
        nv.x/=f;
        nv.y/=f;
        nv.z/=f;

        return nv;
    }

    Divide(v){

        if(v===0){
            console.error("Divide by zero error");
            return this;
        }

        const nv = this;
        
        nv.x/=v.x;
        nv.y/=v.y;
        nv.z/=v.z;

        return nv;
    }

    Subtract(x,y,z){
        const nv = this;
        nv.x-=x;
        nv.y-=y;
        nv.z-=z;
        return nv;
    }
}