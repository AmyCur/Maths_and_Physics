"use strict";

import { Transform } from "./Transform.js";

export class TransObject {

    static GlobalObjectID = 0;

    static default = () => new TransObject
    (
        Transform.default(),
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

    constructor(transform = Transform.default(), components, properties) {
        this.transform = transform;
        this.components = components;
        this.properties = properties;
    }
}