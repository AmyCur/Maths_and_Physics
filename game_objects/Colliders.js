import { VectorUtil } from "../util/VectorUtil.js";
import { Vector3 } from "../vectors/Vector3.js";
import { objects } from "./Objects.js";

"use strict";

export class BoxCollider {

    static default = () => new BoxCollider(Vector3.zero(), Vector3.one());

    constructor(offset, scale, trigger=false) {
        this.offset = offset;
        this.scale = scale;
        this.trigger=trigger;
    }

    SetTrigger(value){
        return new BoxCollider(this.offset, this.scale, value);
    }
}

export class SphereCollider {
    constructor(offset, radius) {
        this.offset = offset;
        this.radius = radius;
    }
}

export const ColliderUtils = {
    defaultCollider: new BoxCollider(new Vector3(0, 0, 0), new Vector3(1, 1, 1)),

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
    },

    IsColliding(position, addition) {
        // Despite the name (its an array of BufferObjects not colliders)
        const objs = objects.GetAllColliderObjects();
        const collisions = [];

        for (let i = 0; i < objs.length; i++) {
            const co = objs[i];
            if (co.transform.position !== position) {
                const cc = co.components.collider;

                const colliderPosition = VectorUtil.Add(co.transform.position, cc.offset);
                const colliderScale = VectorUtil.MultiplyVector(co.transform.scale, cc.scale);

                const minBound = VectorUtil.Subtract(colliderPosition, colliderScale);
                const maxBound = VectorUtil.Add(colliderPosition, colliderScale);

                if (VectorUtil.VectorInRange(VectorUtil.Add(position, addition), minBound, maxBound)) {
                    collisions.push(co);
                }
            }
        }

        if(collisions.length>0) return { position: position, objects: collisions };

        return { position: VectorUtil.Add(position, addition), objects: [null] };
    },

    MoveWithRespect(position, addition) {
        const collisions = this.IsColliding(position, addition);
        
        for(const col of collisions.objects){
            
            if(col && !col.components.collider.trigger) return collisions.position;
        }

        // if(collisions.x.value) console.log(collisions.x.object);

        return VectorUtil.Add(position, addition);
    },
}