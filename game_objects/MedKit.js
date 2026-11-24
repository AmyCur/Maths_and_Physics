import { Buffer } from "../rendering/Buffer.js";
import { MeshCreator } from "../rendering/BufferManager.js";
import { BoxCollider } from "./Colliders.js";

export class MedKit{
    constructor(heal){
        this.heal=heal;
    }

    static CreateNewMedKit(){
        const wb = Buffer.default();

        const w5 = MeshCreator.CreateMesh(gl, wb, { collider: BoxCollider.default().SetTrigger(true), medKit: new MedKit(100) }, {raycastable: true, name: "Health Pack"});

        w5.transform.position = new Vector3(
            30, 0, 30
        )

        w5.transform.scale = new Vector3(
            10, 5, 10
        )




        walls.push(w5);
    }
}