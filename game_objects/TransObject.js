"use strict";

import { Raycast } from "../input/Raycast.js";
import { MUtil } from "../util/MathUtil.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector3 } from "../vectors/Vector3.js";
import { camera } from "./camera.js";
import { objects } from "./Objects.js";
import { Transform } from "./Transform.js";

export class TransObject {


    static default = () => new TransObject
        ({
            transform: Transform.default(),
            velocity: {
                current: Vector3.zero(),
                min: -300,
                max: 300
            },
            components: {
                collider: null,

            },
            properties: {
                name: "Unnamed TransObject",
            }
        })

    transform;
    components;
    properties;
    velocityReductionSpeed = new Vector3(0.9, 0.9, 0.9);
    // transform = Transform.default(), velocity = Vector3.zero(), components, properties

    constructor(transObj) {
        this.transform = transObj.transform;
        this.components = transObj.components;
        this.properties = transObj.properties;
        this.velocity = transObj.velocity;
    }

    ClampVelocityByCollision() {

        const cp = this.transform.position;
        const cv = this.velocity.current;
        const tp = VectorUtil.Add(cp, cv);

        const allObjs = objects.GetAllColliderObjects();

        for (let t = 0; t < 1; t += 0.1) {

            const lerpCP = new Vector3(
                MUtil.lerp(cp.x, tp.x, t),
                MUtil.lerp(cp.y, tp.z, t),
                MUtil.lerp(cp.y, tp.z, t)
            );

            for (let obj of allObjs) {
                const op = obj.transform.position;
                const os = obj.transform.scale;

                const minPos = VectorUtil.Subtract(op, os);
                const maxPos = VectorUtil.Add(op, os);

                if (VectorUtil.VectorInRange(lerpCP, minPos, maxPos)) {
                    console.log(lerpCP);
                    
                    const sx = Math.sign(this.velocity.current.x);
                    const sy = Math.sign(this.velocity.current.y);
                    const sz = Math.sign(this.velocity.current.z);


                    cv.x = MUtil.clamp(cv.x, sx === -1 ? 0 : this.velocity.min, sx === 1 ? 0 : this.velocity.max);
                    cv.y = MUtil.clamp(cv.y, sy === -1 ? 0 : this.velocity.min, sy === 1 ? 0 : this.velocity.max);
                    cv.z = MUtil.clamp(cv.z, sz === -1 ? 0 : this.velocity.min, sz === 1 ? 0 : this.velocity.max);
                    
                }
            }

        }

        return cv;
    }

    Move() {
        this.transform.position.Add(this.ClampVelocityByCollision());
    }

    HandleVelocity(gl) {
        this.Move(gl);
        this.ReduceVelocity();
    }

    ClampVelocityVector(vec) {

        const min = this.velocity.min === undefined ? -10 : this.velocity.min;
        const max = this.velocity.max === undefined ? 10 : this.velocity.max;

        return VectorUtil.ClampVectorByLength(vec, min, max);
    }

    AddVelocity(nv) {
        const currentVelocityVector = this.ClampVelocityVector(VectorUtil.Add(this.velocity.current, nv));
        this.velocity.current = currentVelocityVector;
    }


    ReduceVelocity() {
        this.velocity.current = VectorUtil.MultiplyVector(this.velocity.current, this.velocityReductionSpeed)

        if (MUtil.magnitude(this.velocity.current.x) <= 0.01) this.velocity.current.x = 0;
        if (MUtil.magnitude(this.velocity.current.y) <= 0.01) this.velocity.current.y = 0;
        if (MUtil.magnitude(this.velocity.current.z) <= 0.01) this.velocity.current.z = 0;
    }

    Grounded() {
        const obj = Raycast.ShootRay({
            startPos: VectorUtil.Add(this.transform.position, VectorUtil.MultiplyVector(Vector3.down(), camera.transform.position)),
            direction: Vector3.down(),
            maxRange: 3,
            trans: this
        });


        return obj !== null && !obj?.components.collider.isTrigger;
    }
}