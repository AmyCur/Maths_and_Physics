import { BoxCollider, ColliderUtils } from "../game_objects/Colliders.js";
import { Mesh } from "../game_objects/Mesh.js";
import { objects } from "../game_objects/Objects.js";
import { Vector3 } from "../vectors/Vector3.js";
import { Buffer } from "./Buffer.js";
import { MeshCreator } from "./BufferManager.js";
import { textures } from "./Textures.js";
import {MedKit} from "../game_objects/MedKit.js";

export function CreateWalls(fb, gl) {

    const walls = [];

    const w1 = MeshCreator.CreateMesh(gl, Buffer.default(), { collider: BoxCollider.default() }, { name: "floor", raycastable: true });
    w1.transform.position = new Vector3(
        (fb.transform.position.x - fb.transform.scale.x + w1.transform.scale.x - (w1.transform.scale.x * 2)),
        0,
        w1.transform.position.z
    )

    w1.transform.scale = new Vector3(
        w1.transform.scale.x,
        50,
        fb.transform.scale.z + 1
    )


    walls.push(w1);

    const w2 = MeshCreator.CreateMesh(gl, Buffer.default(), { collider: BoxCollider.default() }, { name: "w2", raycastable: true });



    w2.transform.position = new Vector3(
        -(fb.transform.position.x - fb.transform.scale.x + w2.transform.scale.x - (w2.transform.scale.x * 2)),
        0,
        w2.transform.position.z
    )

    w2.transform.scale = new Vector3(
        w2.transform.scale.x,
        50,
        fb.transform.scale.z + 1
    )

    walls.push(w2);

    const w3 = MeshCreator.CreateMesh(gl, Buffer.default(), { collider: BoxCollider.default() }, { name: "w3", raycastable: true });



    w3.transform.position = new Vector3(
        w3.transform.position.x,
        0,
        -(fb.transform.position.x - fb.transform.scale.x + w3.transform.scale.x - (w3.transform.scale.x * 2)),
    )

    w3.transform.scale = new Vector3(
        fb.transform.scale.x + 1,
        50,
        w3.transform.scale.z,
    )

    walls.push(w3);


    const w4 = MeshCreator.CreateMesh(gl, Buffer.default(), { collider: BoxCollider.default() }, { name: "w4", raycastable: true });


    w4.transform.position = new Vector3(
        w4.transform.position.x,
        0,
        (fb.transform.position.x - fb.transform.scale.x + w4.transform.scale.x - (w4.transform.scale.x * 2)),
    )

    w4.transform.scale = new Vector3(
        fb.transform.scale.x + 1,
        50,
        w4.transform.scale.z,
    )

    walls.push(w4);


    



    // for (let wall of walls) {
    //     wall.SetColor("red");
    // }

    // w1.properties.name = "Wall 1";
    // w2.properties.name = "Wall 2";
    // w3.properties.name = "Wall 3";
    // w4.properties.name = "Wall 4";


    return walls;
}

export function GenerateStaticMeshs(gl) {

    const buffer = Buffer.default();

    const fb = MeshCreator.CreateMesh(gl, buffer, { collider: BoxCollider.default() }, { name: "floor", raycastable: true, texture: textures.loadTexture(gl, textures.paths.stone) });
    fb.transform.scale = new Vector3(100, 1, 100)
    fb.transform.position = new Vector3(0, 0, 0);


    objects.static.push(fb);

    const cbuffer = Buffer.default();


    const cb = MeshCreator.CreateMesh(gl, cbuffer, { collider: BoxCollider.default() }, { name: "ceiling", raycastable: true, texture: textures.loadTexture(gl, textures.paths.stone) });
    cb.transform.scale = new Vector3(100, 1, 100)
    cb.transform.position = new Vector3(0, 30, 0);

    objects.static.push(cb);

    return fb;
}