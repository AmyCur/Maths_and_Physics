import { Enemy } from "../enemies/Enemy.js";
import { EController } from "../enemies/EnemyController.js";
import { objects } from "../game_objects/Objects.js";
import { Buffer } from "../rendering/Buffer.js";
import { MeshCreator } from "../rendering/init-buffers.js";
import { RenderObject } from "../rendering/RenderObject.js";
import { VectorUtil } from "../util/VectorUtil.js";
import { Vector3 } from "../vectors/Vector3.js";

export const Raycast = {
    allObjects: [],

    //TODO: This
    RaycastWithoutIteration(startVec, endVec) {
        const allObjs = objects.GetAllRaycastableObjects();

        for (let i = 0; i < allObjs.length; i++) {

            const col = allObjs[i];

            const cp = col.transform.position;
            const cs = col.transform.scale;

            const minPos = VectorUtil.Subtract(cp, cs);
            const maxPos = VectorUtil.Add(cp, cs);


            if (VectorUtil.WithinRange(rayVec, minPos, maxPos)) {
                console.log(col.properties.name);
                return col;
            }
        }

        return null;
    },

    // Colliders do NOT rotate
    GetHitObject(rayVec) {

        const allObjs = objects.GetAllRaycastableObjects();

        for (let i = 0; i < allObjs.length; i++) {

            const col = allObjs[i];

            const cp = col.transform.position;
            const cs = col.transform.scale;

            const minPos = VectorUtil.Subtract(cp, cs);
            const maxPos = VectorUtil.Add(cp, cs);


            if (VectorUtil.WithinRange(rayVec, minPos, maxPos)) {
                console.log(col.properties.name);
                return {
                    obj: col,
                    position: rayVec
                };
            }
        }

        return null;
    },



    ShootRay(startPos, dir, maxRange, gl) {
        if (objects.GetAllRaycastableObjects().length === 0) {
            console.error("Nothing to raycast");
        }
        else {
            const increments = 400;
            const increment = maxRange / increments;

            for (let i = 0; i < increments; i++) {
                // Distance to travel in this tick
                const outVec = VectorUtil.Multiply(dir, i * increment);


                // Position that will be checked for colliders
                const rayVec = VectorUtil.Add(startPos, outVec);
                // console.log(rayVec);

                // console.log(outVec);
                // console.log(rayVec);
                // console.log(this.allObjects);

                // See if youve hit a collider
                const hitObject = this.GetHitObject(rayVec);

                // If you have return it, else keep going
                if (hitObject?.obj != null) {
                    if (gl !== null) {
                        const bo = MeshCreator.CreateMesh(gl, Buffer.default, {}, {});
                        bo.transform.position=hitObject.position;
                        bo.transform.scale= new Vector3(0.5,0.5,0.5);
                        objects.other.push(
                            bo
                        )
                        setTimeout(() => {objects.other.pop(bo)}, 1000);
                    }


                    // EController.SpawnEnemy(true, rayVec)
                    return hitObject.obj;
                }
            }
        }




    }
}