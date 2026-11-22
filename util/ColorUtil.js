export const ColorUtil = {
    red() {
        return [
            [1, 0, 0, 1.0], // Front face: white
            [1, 0, 0, 1.0], // Front face: white
            [1, 0, 0, 1.0], // Front face: white
            [1, 0, 0, 1.0], // Front face: white
            [1, 0, 0, 1.0], // Front face: white
            [1, 0, 0, 1.0] // Front face: white
        ]
    },

    green() {
        return [
            [0, 1, 0, 1.0], // Front face: white
            [0, 1, 0, 1.0], // Front face: white
            [0, 1, 0, 1.0], // Front face: white
            [0, 1, 0, 1.0], // Front face: white
            [0, 1, 0, 1.0], // Front face: white
            [0, 1, 0, 1.0] // Front face: white
        ]
    },

    blue() {
        return [
            [0, 0, 1, 1.0], // Front face: white
            [0, 0, 1, 1.0], // Front face: white
            [0, 0, 1, 1.0], // Front face: white
            [0, 0, 1, 1.0], // Front face: white
            [0, 0, 1, 1.0], // Front face: white
            [0, 0, 1, 1.0] // Front face: white
        ]
    },

    random() {
        return [
            [Math.random(), Math.random(), Math.random(), 1.0], // Front face: white
            [Math.random(), Math.random(), Math.random(), 1.0], // Front face: white
            [Math.random(), Math.random(), Math.random(), 1.0], // Front face: white
            [Math.random(), Math.random(), Math.random(), 1.0], // Front face: white
            [Math.random(), Math.random(), Math.random(), 1.0], // Front face: white
            [Math.random(), Math.random(), Math.random(), 1.0], // Front face: white
        ]
    },

    randomOne(){
        const random= [Math.random(), Math.random(), Math.random(), 1.0];
        
        return [
            random,
            random,
            random,
            random,
            random,
            random,
        ]
    }


}