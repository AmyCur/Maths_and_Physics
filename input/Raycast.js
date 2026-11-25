import { objects } from "../game_objects/Objects.js";
import { VectorUtil } from "../util/VectorUtil.js";

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
                return {
                    obj: col,
                    position: rayVec
                };
            }
        }

        return null;
    },



    ShootRay(data) {
        if (objects.GetAllRaycastableObjects().length === 0) {
            console.warn("Nothing to raycast");
        }
        else {
            const increments = data.increments === undefined ? 150 : data.increments;
            const increment = data.maxRange / increments;

            for (let i = 0; i < increments; i++) {
                // Distance to travel in this tick
                const outVec = VectorUtil.Multiply(data.direction, i * increment);


                // Position that will be checked for colliders
                const rayVec = VectorUtil.Add(data.startPos, outVec);

                // See if youve hit a collider
                const hitObject = this.GetHitObject(rayVec);

                // If you have return it, else keep going
                if (hitObject?.obj != null && hitObject!==data.trans) {

                    //! This is a Mesh (God i wish JS had types!)
                    return hitObject.obj;
                }
            }
        }

        return null;




    }
}