


const vertices = new Float32Array([
    // x    y    z
    -0.5, -0.5, 0.0, // vertex 0    2 --- 3
    0.5, -0.5, 0.0, // vertex 1     |     |
    -0.5,  0.5, 0.0, // vertex 2    0 --- 1
    0.5, 0.5,  0.0,
    0.0, 1.0, 0.0,
    1, 0.8,0,
    -1, 0.8, 0,
]);

const houseData = new GameObject(
    new Vector3(0,0,-1),
    new Vector3(0,0, 0),
    new Vector3(1,1,1),
    new Float32Array([
        // x    y    z                    4
        -0.5, -0.5, 0.0, // vertex 0     /\
        0.5, -0.5, 0.0, // vertex 1     /  \
        -0.5,  0.5, 0.0, // vertex 2   2 ---3
        0.5, 0.5,  0.0, // vertex 3    |    |
        0.0, 1.0,  0.0 // vertex 4     0 ---1
    ])
)

const doorData = new Float32Array([
    0.0, -0.5, 0.0,
    0.3, -0.5, 0.0,
    0.0, -0.1, 0.0,
    0.3, -0.1, 0.0
]);

const grassData = new Float32Array([
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
]);