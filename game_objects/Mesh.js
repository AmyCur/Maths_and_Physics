import { Buffer } from "../rendering/Buffer.js";
import { Transform } from "./Transform.js";
import { TransObject } from "./TransObject.js";
import {ColorUtil} from "../util/ColorUtil.js";


"use strict";

export class Mesh extends TransObject{
    static default = () => new Mesh(
        Buffer.default(),
        Transform.default(),
    )

    static defaultProperties(){
        return {
            name: "Kevin",
            raycastable: true,
        }
    };



    constructor(bufferData, transform,  components = {}, properties = Mesh.defaultProperties(), buffers){
        
        super(transform, components, properties);

        this.buffers=buffers;
        this.bufferData=bufferData;

        this.transform=transform;

        this.components=components;
        this.properties=properties;
        // console.log(this.IsEnemy());
    }

    static GetColor(tc){
        let targetColor;

        if(tc==="red") targetColor=ColorUtil.red();
        if(tc==="green") targetColor=ColorUtil.green();
        if(tc==="blue") targetColor=ColorUtil.blue();


        return targetColor;
    }

    IsEnemy(){
        console.log("Called");
        if(this.components===undefined) return false;
        return Object.hasOwn(this.components, "enemy");
    }
}