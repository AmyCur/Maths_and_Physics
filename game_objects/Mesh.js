import { Buffer } from "../rendering/Buffer.js";
import { Transform } from "./Transform.js";
import { TransObject } from "./TransObject.js";

import { Mat4 } from "../vectors/Mat4.js";
import { Texturing } from "../rendering/textures/Texturing.js";
import { player } from "./Player.js";


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



    GetModelMatrix(){
        const modelMatrix = new Mat4();

        
        modelMatrix.translate([this.transform.position.x, this.transform.position.y, this.transform.position.z]);
        modelMatrix.scale([this.transform.scale.x, this.transform.scale.y, this.transform.scale.z]);

        modelMatrix.rotate([1, 0, 0], this.transform.rotation.x);
        modelMatrix.rotate([0, 1, 0], this.transform.rotation.y);
        modelMatrix.rotate([0, 0, 1], this.transform.rotation.z);

        return modelMatrix;
    };

    constructor(bufferData, transform,  components = {}, properties = Mesh.defaultProperties(), buffers){
        
        super(transform, components, properties);

        this.buffers=buffers;
        this.bufferData=bufferData;

        this.transform=transform;

        this.components=components;
        this.properties=properties;

        this.texture=Texturing.loadTexture(player.gl, "../imgs/mario.png");

        // console.log(this.IsEnemy());
    }


    IsEnemy(){
        if(this.components===undefined) return false;
        return Object.hasOwn(this.components, "enemy");
    }
}