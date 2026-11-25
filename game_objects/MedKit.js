import { EnemyManager } from "../enemies/EnemyManager.js";
import { Buffer } from "../rendering/Buffer.js";
import { MeshCreator } from "../rendering/MeshCreator.js";
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
        const tv = EnemyManager.GetRandomVectorAroundThePlayer();

        MeshCreator.CreateMesh(gl, {
            shape: "cube",
            properties: {
                name: "MedKit",
                raycastable: false,
                texture: textures.paths.health_pack
            },            
            components: {
                collider: BoxCollider.default().SetTrigger(true)
            },
            transform: Transform.default().SetPosition(tv).SetScalef(10,5,10),
            velocity: Vector3.zero(),
            targetArray: (v) => objects.mesh.other.push(v)
        })
    }
}