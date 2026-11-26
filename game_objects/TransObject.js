"use strict";

import { Raycast } from "../input/Raycast.js";
import { MUtil } from "../util/MathUtil.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector3 } from "../vectors/Vector3.js";
import { camera } from "./camera.js";
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

    Move() {

        const cp = this.transform.position;

        const rayValues = [];

        const directions = [
            new Vector3(-1, 0, 0),
            new Vector3(1, 0, 0),
            new Vector3(0, -1, 0),
            new Vector3(0, 1, 0),
            new Vector3(0, 0, -1),
            new Vector3(0, 0, 1),
        ];


        for (let dir of directions) {
            rayValues.push(
                Raycast.ShootRay({
                    startPos: VectorUtil.Add(cp, VectorUtil.MultiplyVector(dir, camera.transform.position)),
                    direction: dir,
                    maxRange: (this.transform.scale.x) + 0.05,
                    increments: 100
                }) !== null
            )
        }

        const vol = this.velocity.current;
        const mb = 100_000;

        vol.x = MUtil.clamp(vol.x, rayValues[0] ? 0 : -mb, rayValues[1] ? 0 : mb);
        vol.y = MUtil.clamp(vol.y, rayValues[2] ? 0 : -mb, rayValues[3] ? 0 : mb);
        vol.z = MUtil.clamp(vol.z, rayValues[4] ? 0 : -mb, rayValues[5] ? 0 : mb);
        
        this.transform.position.Add(vol);
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