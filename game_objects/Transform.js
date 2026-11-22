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

    SetPosition(position){
        return new Transform(position, this.rotation, this.scale);
    }

    SetPositionf(x,y,z){
        return new Transform(new Vector3(x,y,z), this.rotation, this.scale);
    }

    SetRotation(rotation){
        return new Transform(this.position, rotation, this.scale);
    }

    SetRotationf(x,y,z){
        return new Transform(this.position, new Vector3(x,y,z), this.scale);
    }

    SetScale(scale){
        return new Transform(this.position, this.rotation, scale);
    }

    SetScalef(x,y,z){
        return new Transform(this.position, this.rotation, new Vector3(x,y,z));
    }
}