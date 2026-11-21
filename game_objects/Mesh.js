import { Buffer } from "../rendering/Buffer.js";
import { Transform } from "./Transform.js";
import { TransObject } from "./TransObject.js";

"use strict";

export class Mesh extends TransObject{

   

    static default = () => new Mesh(
        Buffer.default(),
        Transform.default(),
    )

    constructor(bufferData, transform,  components = {}, properties = {name: "Kevin", raycastable: true}, buffers){
        
        super(transform, components, properties);

        this.buffers=buffers;
        this.bufferData=bufferData;

        this.transform=transform;

        this.components=components;
        this.properties=properties;
        // console.log(this.IsEnemy());
    }

    SetColor(){

    }

    IsEnemy(){
        console.log("Called");
        if(this.components===undefined) return false;
        return Object.hasOwn(this.components, "enemy");
    }
}