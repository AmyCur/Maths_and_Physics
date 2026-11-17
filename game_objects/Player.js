import { Vector3 } from "../vectors/Vector3.js";

class Player{
    constructor(position){
        this.position=position;
    }

    SetPos(pos){
        this.position=pos;
    }    
}

export const player = new Player(new Vector3(15, 0, -10));