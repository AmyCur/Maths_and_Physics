import { Vector3 } from "./Vector3.js";

class Player{
    constructor(positon){
        this.position=positon;
    }

    keysDown = []

    BindInputs(){
        document.addEventListener("keydown", (ev) => {
            this.keysDown.push(ev.key);
        })

        document.addEventListener("keyup", (ev) => {
            if(this.keysDown.includes(ev.key)) this.keysDown.pop(ev.key);
        })
            
        
    }
}

let player = new Player(
    new Vector3(0,0,-10)
);

player.BindInputs();

export {player};