import { BoxCollider } from "../game_objects/Colliders.js";
import { objects } from "../game_objects/Objects.js";
import { Vector3 } from "../vectors/Vector3.js";
import { Buffer } from "./Buffer.js";
import { MeshCreator } from "./MeshCreator.js";
import { textures } from "./Textures.js";
import { GetCube } from "./shapes/Cube.js";
import { Transform } from "../game_objects/Transform.js";
import { player } from "../game_objects/Player.js";
import { VectorUtil } from "../util/VectorUtil.js";

export function CreateWalls(fb, gl) {

    const texture = textures.paths.tung;


    MeshCreator.CreateMesh(gl, {
        shape: "cube",
        properties: {
            raycastable: true,
            name: "W1",
            texture: texture
        },
        components: {
            collider: BoxCollider.default(),
        },
        transform: Transform.default().SetPositionf(500, 0, 0).SetScalef(1, 100, 100),
        velocity: {
            current: Vector3.zero(),
        },
        targetArray: (v) => objects.mesh.static.push(v)

    });

    // MeshCreator.CreateMesh(gl, {
    //     shape: "cube",
    //     properties: {
    //         raycastable: true,
    //         name: "W2",
    //         texture: texture
    //     },
    //     components: {
    //         collider: BoxCollider.default(),
    //     },
    //     transform: Transform.default().SetPositionf(-100, 0, 0).SetScalef(1, 100, 100),
    //     velocity: {
    //         current: Vector3.zero(),
    //     },
    //     targetArray: (v) => objects.mesh.static.push(v)

    // });

    // MeshCreator.CreateMesh(gl, {
    //     shape: "cube",
    //     properties: {
    //         raycastable: true,
    //         name: "W3",
    //         texture: texture
    //     },
    //     components: {
    //         collider: BoxCollider.default(),
    //     },
    //     transform: Transform.default().SetPositionf(0, 0, 100).SetScalef(100, 100, 1),
    //     velocity: {
    //         current: Vector3.zero(),
    //     },
    //     targetArray: (v) => objects.mesh.static.push(v)
    // });

    // MeshCreator.CreateMesh(gl, {
    //     shape: "cube",
    //     properties: {
    //         raycastable: true,
    //         name: "W4",
    //         texture: texture
    //     },
    //     components: {
    //         collider: BoxCollider.default(),
    //     },
    //     transform: Transform.default().SetPositionf(0, 0, -100).SetScalef(100, 12.5, 1),
    //     velocity: {
    //         current: Vector3.zero(),
    //     },
    //     targetArray: (v) => objects.mesh.static.push(v)
    // });
}

export function GenerateStaticMeshs(gl) {

    const buffer = GetCube();
    //  buffer, { collider: BoxCollider.default() }, { name: "floor", raycastable: true, texture: textures.loadTexture(gl, textures.paths.stone) }
    const fb = MeshCreator.CreateMesh(gl, {
        shape: "cube",
        properties: {
            raycastable: true,
            name: "Floor",
            texture: textures.paths.grass
        },
        components: {
            collider: BoxCollider.default(),
        },
        transform: Transform.default().SetPosition(Vector3.zero()).SetScalef(100, 1, 100),
        velocity: {
            current: Vector3.zero(),
        },
        targetArray: (v) => objects.mesh.static.push(v)

    });

    MeshCreator.CreateMesh(gl, {
        shape: "cube",
        properties: {
            raycastable: true,
            name: "Floor",
            texture: textures.paths.grass
        },
        components: {
            collider: BoxCollider.default(),
        },
        transform: Transform.default().SetPosition(VectorUtil.Add(fb.transform.position, fb.transform.scale)).SetScalef(100, 1, 100),
        velocity: {
            current: Vector3.zero(),
        },
        targetArray: (v) => objects.mesh.static.push(v)

    });

    MeshCreator.CreateMesh(gl, {
        shape: "cube",
        properties: {
            raycastable: true,
            name: "Ceiling",
            texture: textures.paths.stone
        },
        components: {
            collider: BoxCollider.default(),
        },
        transform: Transform.default().SetPositionf(0, 100, 0).SetScalef(100, 1, 100),
        velocity: {
            current: Vector3.zero(),
        },
        targetArray: (v) => objects.mesh.static.push(v)

    });

    MeshCreator.CreateMesh(gl, {
        shape: "cube",
        properties: {
            raycastable: true,
            name: "Floor 2",
            texture: textures.paths.grass
        },
        components: {
            collider: BoxCollider.default(),
        },
        transform: Transform.default().SetPositionf(0, 10, -200).SetScalef(100, 1, 100),
        velocity: {
            current: Vector3.zero(),
        },
        targetArray: (v) => objects.mesh.static.push(v)

    });

    const allColliders = objects.GetAllColliderObjects();

    for (const mesh of allColliders) {

        const cp = mesh.transform.position;
        const scale = mesh.transform.scale;

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


        // for (const cornerPos of corners) {
        const meshPos = mesh.transform.position;
        const meshScale = mesh.transform.scale;

        const colliderPositionOffset = mesh.components.collider.offset;
        const colliderScaleOffset = mesh.components.collider.scale;

        const colliderPos = VectorUtil.Add(meshPos, colliderPositionOffset);
        const colliderScale = VectorUtil.MultiplyVector(meshScale, colliderScaleOffset);

        const minBounds = VectorUtil.Subtract(colliderPos, VectorUtil.Dividef(colliderScale, 2));
        const maxBounds = VectorUtil.Add(colliderPos, VectorUtil.Dividef(colliderScale, 2));

        MeshCreator.CreateMesh(gl, {
            shape: "cube",
            properties: {
                raycastable: true,
                name: "Floor 2",
                texture: textures.paths.tung
            },
            components: {
                collider: BoxCollider.default(),
            },
            transform: Transform.default().SetPosition(minBounds).SetScalef(0.8, 0.8, 0.8),
            velocity: {
                current: Vector3.zero(),
            },
            targetArray: (v) => objects.mesh.static.push(v)

        })

        MeshCreator.CreateMesh(gl, {
            shape: "cube",
            properties: {
                raycastable: true,
                name: "Floor 2",
                texture: textures.paths.tung
            },
            components: {
                collider: BoxCollider.default(),
            },
            transform: Transform.default().SetPosition(maxBounds).SetScalef(0.8, 0.8, 0.8),
            velocity: {
                current: Vector3.zero(),
            },
            targetArray: (v) => objects.mesh.static.push(v)

        })
    }
    // }





    return fb;
}