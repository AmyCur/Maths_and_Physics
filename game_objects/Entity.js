import { GameObject } from "./GameObject.js";

export class Entity extends GameObject{
    constructor(position, scale, rotation, health){
        super(position,scale,rotation);
        this.health=health;
    }

    TakeDamage(damage){
        this.health-=damage;
        if(this.health<=0) this.Die();
    
    }

    Die(){}
}