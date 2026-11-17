import { Vector3 } from "../vectors/Vector3.js";

class Player{
    constructor(position){
        this.gravityScale=1;
        this.position=position;
        this.jumping=false;
    }

    SetPos(pos){
        this.position=pos;
    }   

    Grounded(){
        return this.position.y>=0;
    }
    
    Gravity(){
        if(this.Grounded() || this.jumping){
            this.gravityScale=1;
            this.position.y=0;
        }

        else{
            this.position.y+=0.1*this.gravityScale;
            this.gravityScale*=1.06;
        }
    }

    Jump(){
        this.jumping=true;
        for(let i = 0; i < 100; i++){
            this.position.y-=0.3;
        }
        this.jumping=false;
    }
}

export const player = new Player(new Vector3(15, 0, -10));