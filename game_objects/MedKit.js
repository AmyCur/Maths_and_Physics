import { EnemyManager } from "../enemies/EnemyManager.js";
import { Buffer } from "../rendering/Buffer.js";
import { MeshCreator } from "../rendering/BufferManager.js";
import { textures } from "../rendering/Textures.js";
import { Vector3 } from "../vectors/Vector3.js";
import { BoxCollider } from "./Colliders.js";
import { objects } from "./Objects.js";
import { Transform } from "./Transform.js";

export class MedKit{
    constructor(heal){
        this.heal=heal;
    }

    static CreateNewMedKit(gl){
        const wb = Buffer.default();

        const tv = EnemyManager.GetRandomVectorAroundThePlayer();

        const w5 = MeshCreator.CreateMesh(gl, wb, { collider: BoxCollider.default().SetTrigger(true), medKit: new MedKit(100) }, {raycastable: true, name: "Health Pack"}, Transform.default().SetPosition(new Vector3(tv.x, 3, tv.z)));
        w5.texture=textures.loadTexture(gl, textures.GetRandomTexture());
        // const w5 = MeshCreator.CreateMesh(gl, Buffer.default(), {}, {}, Transform.default());

        // w5.transform.position = new Vector3(
        //     30, 0, 30
        // )

        w5.transform.scale = new Vector3(
            10, 5, 10
        )


        objects.mesh.other.push(w5);
        console.log(objects.mesh.other);
    }
}