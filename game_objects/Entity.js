import { EController } from "../enemies/EnemyController.js";
import { GameObject } from "./GameObject.js";

export class Entity extends GameObject{
    constructor(position, scale, rotation, health){
        super(position,scale,rotation);
        this.health=health;
    }

}