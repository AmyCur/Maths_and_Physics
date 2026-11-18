import { Time } from "../util/Time.js";

export class Attack{
    
    onCD=false;
    attackDT= 0;
    targetDT= 0;

    constructor(cdTime=1, damage=10){
        this.cdTime=cdTime;
        this.damage=damage;
    }

    CheckCD(){
        this.attackDT+=Time.deltaTime;
        if(this.attackDT >=this.targetDT){
            this.onCD=false;
        }
    }

    Cooldown(){
        this.onCD=true;
        this.attackDT=0;
        this.targetDT=this.cdTime;
    }
}