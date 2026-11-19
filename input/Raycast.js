import { EController } from "../enemies/EnemyController.js";
import { objects } from "../game_objects/Objects.js";
import { VectorUtil } from "../util/VectorUtil.js";

export const Raycast = {
    allObjects: [],

    // Colliders do NOT rotate
    GetHitCollider(rayVec) {
        for (let i = 0; i < objects.enemies.length; i++) {
            const col = objects.enemies[i];
            const cp = col.transform.position;
            const cs = col.transform.scale;

            const minPos = VectorUtil.Subtract(cp, cs);
            const maxPos = VectorUtil.Add(cp, cs);
         

            if (VectorUtil.WithinRange(rayVec, minPos, maxPos) && objects.IsEnemy(col)) {
            //     console.log(`
            //     min: ${minPos.Print()},    
            //     max: ${maxPos.Print()},    
            //     vector pos: ${rayVec.Print()},   
            //     hit: ${VectorUtil.WithinRange(rayVec, minPos, maxPos)} 
            // `)
                console.log(`HIT!!!! ${col}`);
                return col.components.enemy;
            }
        }


        return null;
    },

    ShootRay(startPos, dir, maxRange) {
        if (objects.enemies.length === 0) {
            console.error("No primatives");

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
                const hitCollider = this.GetHitCollider(rayVec);

                // If you have return it, else keep going
                if (hitCollider != null) {
                    // EController.SpawnEnemy(true, rayVec)
                    return hitCollider;
                }
            }
        }




    }
}