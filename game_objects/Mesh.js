import { TransObject } from "./TransObject.js";

export class Mesh extends TransObject{

    "use strict";
    constructor(buffers, transform, renderObject, components = {}, properties = {name: "Kevin", raycastable: true}){
        
        super(transform, components, properties);

        this.buffers=buffers;
        this.transform=transform;
        this.renderObject=renderObject;
        this.components=components;
        this.properties=properties;
        // console.log(this.IsEnemy());
    }

    IsEnemy(){
        console.log("Called");
        if(this.components===undefined) return false;
        return Object.hasOwn(this.components, "enemy");
    }
}