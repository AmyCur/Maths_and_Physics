import { VectorUtil } from "../util/VectorUtil.js";
import { Vector3 } from "../vectors/Vector3.js";

export class BoxCollider {
    constructor(offset, scale) {
        this.offset = offset;
        this.scale = scale;
    }
}

export class SphereCollider {
    constructor(offset, radius) {
        this.offset = offset;
        this.radius = radius;
    }
}

export const ColliderUtils = {
    defaultCollider : new BoxCollider(new Vector3(0,0,0), new Vector3(1,1,1)),
    
    GetColliderBounds(object, collider) {
        const objPos = object.transform.position;
        const colOffset = collider.offset;

        const colliderPos = VectorUtil.Add(objPos, colOffset);

        const objScale = object.transform.scale;
        const colScale = collider.scale;

        const colliderSize = VectorUtil.MultiplyVector(objScale, colScale);

        // console.log(colliderPos, colliderSize);

        const minBound = VectorUtil.Subtract(colliderPos, colliderSize);
        const maxBound = VectorUtil.Add(colliderPos, colliderSize);

        return {
            min: minBound,
            max: maxBound,
            pos: colliderPos,
            size: colliderSize
        }
    }
}