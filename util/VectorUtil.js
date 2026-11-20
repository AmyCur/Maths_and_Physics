import { camera } from "../game_objects/camera.js";
import { ColliderUtils } from "../game_objects/Colliders.js";
import { objects } from "../game_objects/Objects.js";
import { player } from "../game_objects/Player.js";
import { Vector2 } from "../vectors/Vector2.js";
import { Vector3 } from "../vectors/Vector3.js";
import { SUtil } from "./StringUtil.js";

export const VectorUtil = {
    Print(v, mult = 1) {
        const x = SUtil.TruncateComponent(v.x * mult);
        const y = SUtil.TruncateComponent(v.y * mult);
        const z = SUtil.TruncateComponent(v.z * mult);
        return `X: ${x}, Y: ${y}, Z: ${z}`;
    },

    Subtract(v1, v2) {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    },

    Multiply(v1, f) {
        const nx = v1.x * f;
        const ny = v1.y * f;
        const nz = v1.z * f;

        return new Vector3(nx, ny, nz);
    },

    Clamp(vec, min, max) {
        const v = vec;
        if (v.x < min.x) v.x = min.x;
        if (v.x > max.x) v.x = max.x;

        if (v.y < min.y) v.y = min.y;
        if (v.y > max.y) v.y = max.y;

        if (v.z < min.z) v.z = min.z;
        if (v.z > max.z) v.z = max.z;

        return v;
    },

    ClampPlayerPositon(pp, min, max) {
        min.y = -10000;
        max.y = 10000;
        const clampedPos = this.Clamp(pp, min, max);
        clampedPos.y = pp.y;
        return clampedPos;
    },

    GetMinAndMaxBounds(transform) {
        const position = transform.position;
        const scale = transform.scale;

        const minPos = this.Subtract(position, this.Multiply(scale, 5));
        const maxPos = this.Add(position, this.Multiply(scale, 5));

        // console.log("Min", minPos, "\n Max: ", maxPos);


        return {
            min: minPos,
            max: maxPos
        };
    },

    InRange(f, min, max) {
        return f >= min && f <= max;
    },

    VectorInRange(v, min, max){
        const xir = this.InRange(v.x,min.x,max.x);
        const yir = this.InRange(v.y,min.y,max.y);
        const zir = this.InRange(v.z,min.z,max.z);

        return (xir && yir && zir);
    },

    MultiplyVector(v1, v2) {
        const v = new Vector3(0, 0, 0);
        v.x = v1.x * v2.x;
        v.y = v1.y * v2.y;
        v.z = v1.z * v2.z;

        return v;
    },



    
    IsColliding(position, addition){
        // Despite the name (its an array of BufferObjects not colliders)
        const colliders = objects.GetAllColliderObjects();
        
        for(let i = 0;i < colliders.length; i++){
            const co = colliders[i];
            const cc = co.components.collider;

            const colliderPosition = this.Add(co.transform.position, cc.offset);
            const colliderScale = this.MultiplyVector(co.transform.scale, cc.scale);

            const minBound = this.Subtract(colliderPosition, colliderScale);
            const maxBound = this.Add(colliderPosition, colliderScale);

            if(this.VectorInRange(this.Add(position, addition), minBound, maxBound)) {
                console.log(minBound);
                console.log(maxBound);
                console.log(colliderPosition);
                console.log(position);
                return {position: position, object: co};
            }
        }

        return {position: this.Add(position, addition), object:null};
    },

    DetermineCollision(position, addition) {
        const collisions = this.IsColliding(position, addition);
        if(collisions.object!=null) console.log(collisions.object);

        // if(collisions.x.value) console.log(collisions.x.object);

        return collisions.position;
    },

    ClampPositionInWorld(position, addition) {
        const p = this.Add(position, addition);
        const floor = objects.static[0];
        const minPos = VectorUtil.Subtract(floor.transform.position, VectorUtil.Subtract(floor.transform.scale, new Vector3(1, 0, 1)));
        const maxPos = VectorUtil.Add(floor.transform.position, VectorUtil.Subtract(floor.transform.scale, new Vector3(1, 0, 1)));
        let newPos = VectorUtil.ClampPlayerPositon(p, minPos, maxPos);

        return newPos;
    },

    WithinRange(v, min, max) {
        const xInRange = v.x >= min.x && v.x <= max.x;
        const yInRange = v.y >= min.y && v.y <= max.y;
        const zInRange = v.z >= min.z && v.z <= max.z;

        return xInRange && yInRange && zInRange;
    },

    Add(v1, v2) {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    },

    GetLength(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    },

    Invert(v) {
        return new Vector3(-v.x, -v.y, -v.z);
    },

    GetDotProductAngle(v1, v2) {

    },


    GetCameraForwardVector() {
        const rot = camera.rotation;

        const alpha = rot.x;
        const beta = rot.y;

        return this.GetVectorFromAngles(alpha, beta);
    },

    GetVectorFromAngles(alpha, beta) {


        const x = Math.cos(alpha) * Math.cos(beta);
        const z = Math.sin(alpha) * Math.cos(beta);
        const y = Math.sin(beta);

        let attackDir = new Vector3(-z, y, -x);

        return this.Normalize(attackDir);
    },

    Normalize(v) {
        if (v.x === 0 && v.y === 0 && v.z === 0) return new Vector3(0, 0, 0);
        const len = this.GetLength(v);
        return this.Multiply(v, 1 / len);
    },

    IsZero(v) {
        return v.x === 0 && v.y === 0 && v.z === 0;
    }
}