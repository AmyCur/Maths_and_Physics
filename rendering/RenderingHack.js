import { BoxCollider } from "../game_objects/Colliders.js";
import { objects } from "../game_objects/Objects.js";
import { Vector3 } from "../vectors/Vector3.js";
import { Buffer } from "./Buffer.js";
import { MeshCreator } from "./MeshCreator.js";
import { textures } from "./Textures.js";
import { GetCube } from "./shapes/Cube.js";
import { Transform } from "../game_objects/Transform.js";

export function CreateWalls(fb, gl) {

    MeshCreator.CreateMesh(gl, {
        shape: "cube",
        properties: {
            raycastable: true,
            name: "W1"
        },
        components: {
            collider: BoxCollider.default(),
        },
        transform: Transform.default().SetPositionf(100, 0, 0).SetScalef(1, 30, 100),
        velocity: Vector3.zero(),
        targetArray: (v) => objects.mesh.static.push(v)

    });

    MeshCreator.CreateMesh(gl, {
        shape: "cube",
        properties: {
            raycastable: true,
            name: "W2"
        },
        components: {
            collider: BoxCollider.default(),
        },
        transform: Transform.default().SetPositionf(-100, 0, 0).SetScalef(1, 30, 100),
        velocity: Vector3.zero(),
        targetArray: (v) => objects.mesh.static.push(v)

    });

    MeshCreator.CreateMesh(gl, {
        shape: "cube",
        properties: {
            raycastable: true,
            name: "W3"
        },
        components: {
            collider: BoxCollider.default(),
        },
        transform: Transform.default().SetPositionf(0, 0, 100).SetScalef(100, 30, 1),
        velocity: Vector3.zero(),
        targetArray: (v) => objects.mesh.static.push(v)
    });

    MeshCreator.CreateMesh(gl, {
        shape: "cube",
        properties: {
            raycastable: true,
            name: "W4"
        },
        components: {
            collider: BoxCollider.default(),
        },
        transform: Transform.default().SetPositionf(0, 0, -100).SetScalef(100, 30, 1),
        velocity: Vector3.zero(),
        targetArray: (v) => objects.mesh.static.push(v)
    });
}

export function GenerateStaticMeshs(gl) {

    const buffer = GetCube();
    //  buffer, { collider: BoxCollider.default() }, { name: "floor", raycastable: true, texture: textures.loadTexture(gl, textures.paths.stone) }
    const fb = MeshCreator.CreateMesh(gl, {
        shape: "cube",
        properties: {
            raycastable: true,
            name: "Floor"
        },
        components: {
            collider: BoxCollider.default(),
        },
        transform: Transform.default().SetPosition(Vector3.zero()).SetScalef(100, 1, 100),
        velocity: Vector3.zero(),
        targetArray: (v) => objects.mesh.static.push(v)

    });

    MeshCreator.CreateMesh(gl, {
        shape: "cube",
        properties: {
            raycastable: true,
            name: "Ceiling"
        },
        components: {
            collider: BoxCollider.default(),
        },
        transform: Transform.default().SetPositionf(0, 30, 0).SetScalef(100, 1, 100),
        velocity: Vector3.zero(),
        targetArray: (v) => objects.mesh.static.push(v)

    });

    return fb;
}