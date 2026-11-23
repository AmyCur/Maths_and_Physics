import { Buffer } from "../rendering/Buffer.js";
import { Transform } from "./Transform.js";
import { TransObject } from "./TransObject.js";
import { loadTexture, textures } from "../rendering/Textures.js";
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
            texture: undefined
        }
    };



    constructor(bufferData, transform,  components = {}, properties = Mesh.defaultProperties(), buffers){
        
        super(transform, components, properties);

        this.buffers=buffers;
        this.bufferData=bufferData;

        this.transform=transform;

        this.components=components;
        this.properties=properties;

        
        
        if(properties.texture !== undefined) {
            this.texture = properties.texture;
        }

        else {
            this.texture=loadTexture(player.gl, textures.paths.null);
        }
        // console.log(this.IsEnemy());
    }



    IsEnemy(){
        if(this.components===undefined) return false;
        return Object.hasOwn(this.components, "enemy");
    }
}