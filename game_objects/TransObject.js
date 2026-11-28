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
    drag = new Vector3(0.9, 0.9, 0.9);
    // transform = Transform.default(), velocity = Vector3.zero(), components, properties

    constructor(transObj) {
        this.transform = transObj.transform;
        this.components = transObj.components;
        this.properties = transObj.properties;
        this.velocity = transObj.velocity;
    }

    GetCorners() {
        const cp = this.transform.position;
        const scale = this.transform.scale;

        const corners = [
            // Bottom Front Left
            new Vector3(cp.x - (scale.x / 2), cp.y - (scale.y / 2), cp.z - (scale.z / 2)),

            // Top Back Right
            new Vector3(cp.x + (scale.x / 2), cp.y + (scale.y / 2), cp.z + (scale.z / 2)),
        ]

        return corners;
    }

    IsColliding() {
        const cv = this.velocity.current;
        const vel = this.velocity.current;

        const corners = this.GetCorners();
        const allColliders = objects.GetAllColliderObjects();

        for (let f = 0; f < 1; f += 0.01) {

            if(f>1)f=1;

            const cornerPos = new Vector3(
                MUtil.lerp(corners[0].x, corners[1].x, f),
                MUtil.lerp(corners[0].y, corners[1].y, f),
                MUtil.lerp(corners[0].z, corners[1].z, f)
            )

            const tp = VectorUtil.Add(cornerPos, cv);
            for (const mesh of allColliders) {
                const meshPos = mesh.transform.position;
                const meshScale = mesh.transform.scale;

                const colliderPositionOffset = mesh.components.collider.offset;
                const colliderScaleOffset = mesh.components.collider.scale;

                const colliderPos = VectorUtil.Add(meshPos, colliderPositionOffset);
                const colliderScale = VectorUtil.MultiplyVector(meshScale, colliderScaleOffset);

                const minBounds = VectorUtil.Subtract(colliderPos, VectorUtil.Dividef(colliderScale, 2));
                const maxBounds = VectorUtil.Add(colliderPos, VectorUtil.Dividef(colliderScale, 2));


                for (let t = 0; t < 1; t += 0.05) {

                    const vLerp = new Vector3(
                        MUtil.lerp(cornerPos.x, tp.x, t),
                        MUtil.lerp(cornerPos.y, tp.y, t),
                        MUtil.lerp(cornerPos.z, tp.z, t)
                    )

                    if (VectorUtil.VectorInRange(vLerp, minBounds, maxBounds)) {
                        const xNeg = Math.sign(cv.x) === -1;
                        const yNeg = Math.sign(cv.y) === -1;
                        const zNeg = Math.sign(cv.z) === -1;

                        // this.(VectorUtil.Invert(this.velocity.current));

                        vel.x = 0/*MUtil.clamp(vel.x, xNeg ? 0 : this.velocity.min, xNeg ? this.velocity.max : 0);*/
                        vel.y = 0; MUtil.clamp(vel.y, yNeg ? 0 : this.velocity.min, yNeg ? this.velocity.max : 0);
                        vel.z = 0/*MUtil.clamp(vel.z, zNeg ? 0 : this.velocity.min, zNeg ? this.velocity.max : 0);*/

                        return true;
                    }
                }


            }
        }


        return false;
    }

    ClampVelocityByCollision() {
        if(this.IsColliding()) return Vector3.zero();
        return this.velocity.current;

    }

    Move() {
        // If colliding after movement (i.e object spawned on mobing object without collision checking) move backwards
        if(this.IsColliding()) this.transform.position = VectorUtil.Subtract(this.transform.position, this.velocity.current);
        this.transform.position.Add(this.ClampVelocityByCollision());
    }

    HandleVelocity(gl) {
        this.ReduceVelocity();
        this.Move(gl);
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
        this.velocity.current = VectorUtil.MultiplyVector(this.velocity.current, this.drag)

        if (MUtil.magnitude(this.velocity.current.x) <= 0.01) this.velocity.current.x = 0;
        if (MUtil.magnitude(this.velocity.current.y) <= 0.01) this.velocity.current.y = 0;
        if (MUtil.magnitude(this.velocity.current.z) <= 0.01) this.velocity.current.z = 0;
    }

    Grounded() {
        const obj = Raycast.ShootRay({
            startPos: this.transform.position,
            direction: Vector3.down(),
            maxRange: (this.transform.scale.y),
            trans: this
        });


        return obj !== null && !obj?.components.collider.isTrigger;
    }
}