import { EController } from "../enemies/EnemyManager.js";
import { GameObject } from "./GameObject.js";

//TODO Remove this!
export class Entity extends GameObject{
    "use strict";
    constructor(position, scale, rotation, health){
        super(position,scale,rotation);
        this.health=health;
    }

}