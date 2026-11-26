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
        const vel = this.velocity.current;
        const scale = this.transform.scale;

        // Get all 4 UNIQUE corners
        const corners = [
            // Bottom Front Left corner
            new Vector3(cp.x - (scale.x / 2), cp.y - (scale.y / 2), cp.z - (scale.z / 2)),

            // Bottom Front Right corner
            new Vector3(cp.x + (scale.x / 2), cp.y - (scale.y / 2), cp.z - (scale.z / 2)),

            // Top Front Left corner
            new Vector3(cp.x - (scale.x / 2), cp.y + (scale.y / 2), cp.z - (scale.z / 2)),

            // Top Front Right corner
            new Vector3(cp.x + (scale.x / 2), cp.y + (scale.y / 2), cp.z - (scale.z / 2)),

            // Bottom Back Left corner
            new Vector3(cp.x - (scale.x / 2), cp.y - (scale.y / 2), cp.z + (scale.z / 2)),

            // Bottom Back Right corner
            new Vector3(cp.x + (scale.x / 2), cp.y - (scale.y / 2), cp.z + (scale.z / 2)),

            // Top Back Left corner
            new Vector3(cp.x - (scale.x / 2), cp.y + (scale.y / 2), cp.z + (scale.z / 2)),

            // Top Back Right corner
            new Vector3(cp.x + (scale.x / 2), cp.y + (scale.y / 2), cp.z + (scale.z / 2)),
        ]

        const allColliders = objects.GetAllColliderObjects();

        for(const cornerPos of corners){
            const tp = VectorUtil.Add(cornerPos, cv);
            for(const mesh of allColliders){
                const meshPos = mesh.transform.position;
                const meshScale = mesh.transform.scale;
                
                const colliderPositionOffset = mesh.components.collider.offset;
                const colliderScaleOffset = mesh.components.collider.scale;

                const colliderPos=VectorUtil.Add(meshPos, colliderPositionOffset);
                const colliderScale = VectorUtil.MultiplyVector(meshScale, colliderScaleOffset);

                const minBounds = VectorUtil.Subtract(colliderPos, VectorUtil.Dividef(colliderScale, 2));
                const maxBounds = VectorUtil.Add(colliderPos, VectorUtil.Dividef(colliderScale, 2));

                if(VectorUtil.VectorInRange(tp, minBounds, maxBounds)){
                    const xNeg = Math.sign(cv.x)===-1;
                    const yNeg = Math.sign(cv.y)===-1;
                    const zNeg = Math.sign(cv.z)===-1;

                    vel.x = MUtil.clamp(vel.x, xNeg ? 0 : this.velocity.min, xNeg ? this.velocity.max : 0);
                    vel.y = MUtil.clamp(vel.y, yNeg ? 0 : this.velocity.min, yNeg ? this.velocity.max : 0);
                    vel.z = MUtil.clamp(vel.z, zNeg ? 0 : this.velocity.min, zNeg ? this.velocity.max : 0);
                }
            }
        }


        return vel;
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