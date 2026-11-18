import { Vector3 } from "../vectors/Vector3.js";

export class GameObject{
    constructor(position, scale, rotation= new Vector3(0,0,0)){
        this.position=position;
        this.scale=scale;
        this.rotation=rotation;
    }
}