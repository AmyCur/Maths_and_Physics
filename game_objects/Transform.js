import { Vector3 } from "../vectors/Vector3.js";

export class Transform{

    static default = new Transform();

    position;
    rotation;
    scale;

    constructor(position=Vector3.zero, rotation=Vector3.zero, scale=Vector3.one){
        this.position=position;
        this.rotation=rotation;
        this.scale=scale;
    }
}