import { Buffer } from "../rendering/Buffer.js";
import { Transform } from "./Transform.js";
import { TransObject } from "./TransObject.js";
import { textures } from "../rendering/Textures.js";
import { player } from "./Player.js";
import { Mat4 } from "../vectors/Mat4.js";


"use strict";

export class Mesh extends TransObject {
    static default = () => new Mesh(
        Buffer.default(),
        Transform.default(),
    )

    static defaultProperties() {
        return {
            name: "Kevin",
            raycastable: true,
            texture: undefined
        }
    };


    modelMatrix = new Mat4();

    InitModelMatrix(){
        const mm = new Mat4();
        mm.translate([this.transform.position.x, this.transform.position.y, this.transform.position.z]);
        mm.scale([this.transform.scale.x, this.transform.scale.y, this.transform.scale.z]);

        mm.rotate([1, 0, 0], this.transform.rotation.x);
        mm.rotate([0, 1, 0], this.transform.rotation.y);
        mm.rotate([0, 0, 1], this.transform.rotation.z);

        this.modelMatrix=mm;

        return mm;
    }

    constructor(bufferData, transform, components = {}, properties = Mesh.defaultProperties(), buffers) {

        super(transform, components, properties);

        this.buffers = buffers;
        this.bufferData = bufferData;

        this.transform = transform;

        this.components = components;
        this.properties = properties;



        if (properties.texture !== undefined) {
            this.texture = properties.texture;
        }

        else {
            this.texture = textures.loadTexture(player.gl, textures.paths.null);
        }
        // console.log(this.IsEnemy());
    }



    IsEnemy() {
        if (this.components === undefined) return false;
        return Object.hasOwn(this.components, "enemy");
    }
}