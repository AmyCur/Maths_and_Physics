import { EController } from "../enemies/EnemyController.js";
import { Entity } from "../game_objects/Entity.js";
import { GameObject } from "../game_objects/GameObject.js";
import { input } from "../input/input.js";
import { Raycast } from "../input/Raycast.js";
import { MUtil } from "../util/MathUtil.js";
import { Vector3 } from "../vectors/Vector3.js";

"use strict";

// Formerly known as Primative
export class RenderObject {

    static nextID = 0;

    SetPositionRotationAndScale(position, rotation, scale) {
        this.transform.position = position;
        this.transform.rotation = rotation;
        this.transform.scale = scale;

    }


    constructor
        (
            positions,
            colors,
            indices,
            transform =
                {
                    position: defaultCubeData.position,
                    rotation: new Vector3(0, 0, 0),
                    scale: defaultCubeData.scale,
                },
            health = 100
        ) {

        this.transform = {
            position: transform.position,
            rotation: transform.rotation,
            scale: transform.scale
        }

        this.positions = positions;
        this.colors = colors;
        this.indices = indices;

        this.ID = RenderObject.nextID++;
        console.log(this.ID);
    }

    MakeCube(color) {
        let targetColor;
        if (color !== undefined) targetColor = this.SetColor(color);
        const re = new RenderObject(
            defaultCubeData.positions,
            color === undefined ? defaultCubeData.colors : targetColor,
            defaultCubeData.indicies,
            {
                position: defaultCubeData.transform.position,
                rotation: defaultCubeData.transform.rotation,
                scale: defaultCubeData.transform.scale
            }

        )

        return re;
    }

    MakeSphere() {

    }


    SetColor(c) {
        if (c === "red") return red;
        else if (c === "green") return green;
        else if (c === "blue") return GetBlue();
        else if (c === "random") {
            return [
                [Math.random(), Math.random(), Math.random(), 1.0], // Front face: white
                [Math.random(), Math.random(), Math.random(), 1.0], // Front face: white
                [Math.random(), Math.random(), Math.random(), 1.0], // Front face: white
                [Math.random(), Math.random(), Math.random(), 1.0], // Front face: white
                [Math.random(), Math.random(), Math.random(), 1.0], // Front face: white
                [Math.random(), Math.random(), Math.random(), 1.0], // Front face: white
            ]
        }
        else console.log(`Color not found! ${c}`);
    }
}

// Whole lot of red
const red = [
    [1, 0, 0, 1.0], // Front face: white
    [1, 0, 0, 1.0], // Front face: white
    [1, 0, 0, 1.0], // Front face: white
    [1, 0, 0, 1.0], // Front face: white
    [1, 0, 0, 1.0], // Front face: white
    [1, 0, 0, 1.0] // Front face: white
]

const green = [
    [0, 1, 0, 1.0], // Front face: white
    [0, 1, 0, 1.0], // Front face: white
    [0, 1, 0, 1.0], // Front face: white
    [0, 1, 0, 1.0], // Front face: white
    [0, 1, 0, 1.0], // Front face: white
    [0, 1, 0, 1.0] // Front face: white
]

function GetBlue() {
    return [
        [MUtil.lerp(0, 1, Math.sin(EController.theta * MathUtil.Deg2Rad * 3)), 0, 1, 1.0], // Front face: white
        [MUtil.lerp(0, 1, Math.sin(EController.theta * MathUtil.Deg2Rad * 3)), 0, 1, 1.0], // Front face: white
        [MUtil.lerp(0, 1, Math.sin(EController.theta * MathUtil.Deg2Rad * 3)), 0, 1, 1.0], // Front face: white
        [MUtil.lerp(0, 1, Math.sin(EController.theta * MathUtil.Deg2Rad * 3)), 0, 1, 1.0], // Front face: white
        [MUtil.lerp(0, 1, Math.sin(EController.theta * MathUtil.Deg2Rad * 3)), 0, 1, 1.0], // Front face: white
        [MUtil.lerp(0, 1, Math.sin(EController.theta * MathUtil.Deg2Rad * 3)), 0, 1, 1.0] // Front face: white
    ]
}

const blue = [
    [0, 0, 1, 1.0], // Front face: white
    [0, 0, 1, 1.0], // Front face: white
    [0, 0, 1, 1.0], // Front face: white
    [0, 0, 1, 1.0], // Front face: white
    [0, 0, 1, 1.0], // Front face: white
    [0, 0, 1, 1.0] // Front face: white
]




export const defaultCubeData = {
    positions: [
        // Front face
        -1, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ],
    colors: [
        [0, 0, 1.0, 1.0], // Front face: white
        [0, 1, 1, 1.0], // Back face: red
        [0.0, 1.0, 0.0, 1.0], // Top face: green
        [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0], // Right face: yellow
        [1.0, 0.0, 1.0, 1.0], // Left face: purple
    ],
    indicies: [
        0,
        1,
        2,
        0,
        2,
        3, // front
        4,
        5,
        6,
        4,
        6,
        7, // back
        8,
        9,
        10,
        8,
        10,
        11, // top
        12,
        13,
        14,
        12,
        14,
        15, // bottom
        16,
        17,
        18,
        16,
        18,
        19, // right
        20,
        21,
        22,
        20,
        22,
        23, // left
    ],
    transform: {
        position: new Vector3(0, 0, 0),
        rotation: new Vector3(0, 0, 0),
        scale: new Vector3(2, 2, 2)
    }
}

export const floor = new RenderObject(
    [
        // Front face
        -1, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ],
    [
        [0.0, 1.0, 0.0, 1.0], // Back face: green
        [1.0, 1.0, 1.0, 1.0], // Front face: white
        [1, 0.1, 0.3, 1.0], // Top face: red
        [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0], // Right face: yellow
        [1.0, 0.0, 1.0, 1.0], // Left face: purple
    ],
    [
        0,
        1,
        2,
        0,
        2,
        3, // front
        4,
        5,
        6,
        4,
        6,
        7, // back
        8,
        9,
        10,
        8,
        10,
        11, // top
        12,
        13,
        14,
        12,
        14,
        15, // bottom
        16,
        17,
        18,
        16,
        18,
        19, // right
        20,
        21,
        22,
        20,
        22,
        23, // left
    ],
    {
        position: new Vector3(0, -10, 0),
        rotation: new Vector3(0, 0, 0),
        scale: new Vector3(100, 0.1, 100)
    }

);