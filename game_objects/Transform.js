import { Vector3 } from "../vectors/Vector3.js";

export class Transform {

    static default = () =>
        new Transform(
            Vector3.zero(),
            Vector3.zero(),
            Vector3.one()
        );

    constructor(position, rotation, scale) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }
}