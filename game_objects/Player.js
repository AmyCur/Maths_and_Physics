import { MUtil } from "../util/MathUtil.js";
import { Time } from "../util/Time.js";
import { Vector3 } from "../vectors/Vector3.js";

class Player{ 
    constructor(position, jumpForce){
        this.gravityScale=1;
        this.position=position;
        this.jumping=false;
        this.text = document.getElementById("player-pos");
        this.jumpForce=jumpForce/100;
    }

    UpdateUI(){
        this.text.innerHTML=this.position.Print();
    }

    SetPos(position){
        this.position=position;
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
            this.gravityScale*=1.041
            const distancePerTick = MUtil.clamp(this.gravityScale*0.1, 0, (this.position+(this.gravityScale*0.1)));
            if(player.position.y<=0)console.log(player.position.y);
            else console.warn(player.position.y);
            this.position.y+=distancePerTick;
        }
    }

    Jump(){
        this.jumping=true;
        let i = 0;
        const interval = setInterval(() => {
            this.position.y-=this.jumpForce;
            i++;
            if(i>=150 || this.Grounded()) clearInterval(interval);
        }, 1*Time.deltaTime)
            
        
        this.jumping=false;
    }
}

export const player = new Player(new Vector3(0, 0, 0), 15);