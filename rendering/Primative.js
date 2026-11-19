import { Entity } from "../game_objects/Entity.js";
import { GameObject } from "../game_objects/GameObject.js";
import { Raycast } from "../input/Raycast.js";
import { Vector3 } from "../vectors/Vector3.js";

export class Primative extends Entity {



    copy(prim) {
        return prim;
    }

    SetPosition(position) {
        this.position = position;
    }

    GetPositon() {
        return this.position;
    }

    SetScale(scale) {
        this.scale = scale;
    }

    SetRotation(rotation) {
        this.rotation = rotation;
    }

    SetColor(color) {
        this.colors = color;
    }



    constructor(positions, colors, indices, position, scale, rotation = new Vector3(0, 0, 0), health = 100) {
        super(position, scale, rotation, health);
        this.positions = positions;
        this.primPos = position;
        this.colors = colors;
        this.indices = indices;
    }

    MakeCube(color) {
        let targetColor;
        if (color !== undefined) targetColor = this.SetColor(color);
        return new Primative(
            defaultCubeData.positions,
            color === undefined ? defaultCubeData.colors : targetColor,
            defaultCubeData.indicies,
            defaultCubeData.position,
            defaultCubeData.scale
        )
    }


    SetColor(c) {

        if (c === "red") return red;
        else if (c === "green") return green;
        else if (c === "blue") return blue;
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
    position: new Vector3(0, 0, 0),
    scale: new Vector3(2, 2, 2)
}

export const cube = new Primative(
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
        [1.0, 1.0, 1.0, 1.0], // Front face: white
        [1.0, 0.0, 0.0, 1.0], // Back face: red
        [0.0, 1.0, 0.0, 1.0], // Top face: green
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
    new Vector3(0, 0, 0),
    new Vector3(2, 2, 2)
);

export const floor = new Primative(
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
    new Vector3(0, -10, 0),
    new Vector3(100, 0.1, 100)
);