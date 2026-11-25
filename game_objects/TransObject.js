"use strict";

import { Vector3 } from "../vectors/Vector3.js";
import { Transform } from "./Transform.js";

export class TransObject {

    static GlobalObjectID = 0;

    static default = () => new TransObject
    (
        Transform.default(),
        Vector3.zero(),
        {
            collider: null,

        },
        {
            name: "Unnamed TransObject",
            ID: TransObject.GlobalObjectID++
        }
    )

    transform;
    components;
    properties;
    velocity;

    constructor(transform = Transform.default(), velocity = Vector3.zero(), components, properties) {
        this.transform = transform;
        this.components = components;
        this.properties = properties;
        this.velocity = velocity;
    }

    Move(){
        this.transform.position.Add(this.velocity);
    }
}