import { Time } from "../util/Time.js";

export class Attack{
    
    onCD=false;
    attackDT= 0;
    targetDT= 0;

    constructor(cdTime=1, damage=10, onAttackFunction){
        this.cdTime=cdTime;
        this.damage=damage;
        this.onAttackFunction=onAttackFunction;
    }

    CheckCD(){
        if(this.onCD) this.attackDT+=Time.deltaTime;
        if(this.attackDT >= this.targetDT){
            this.onCD=false;
            this.onAttackFunction();
        }
    }

    Cooldown(){
        this.onCD=true;
        this.attackDT=0;
        this.targetDT=this.cdTime;
    }
}