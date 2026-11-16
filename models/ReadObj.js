function CleanData(data) {
    const cleanData = []

    for (const str of data) {
        const s = str.split(" ");
        s.shift();
        cleanData.push(...s);
    }

    for (let i = 0; i < cleanData.length; i++) {
        cleanData[i] = parseFloat(cleanData[i]);
    }

    return cleanData;
}

function ReadVerticies(contents) {
    const vertLines = [];
    for (const str of contents) {
        const re = new RegExp("v ");
        if (re.exec(str)) vertLines.push(str);
    }


    return new Float32Array(CleanData(vertLines));
}

function ReadIndicies(contents) {
    const dirtyIndicies = [];
    for (const str of contents) {
        const re = new RegExp("f ");
        if (re.exec(str)) {
            dirtyIndicies.push(str);
        }
    }

    const cleanTriplet = [];

    for(const index of dirtyIndicies){
        const splitIndex = index.split(" ");
        splitIndex.shift();
        for(const c of splitIndex){
            const splitChar = c.split("/");
            cleanTriplet.push(...splitChar);
        }
    }

    const cleanData = [];

    for(let i= 0; i < cleanTriplet.length; i++){
        if(i%3===0) cleanData.push(parseFloat(cleanTriplet[i]));
    }



    const cleanedData = new Uint16Array(cleanData);
    return cleanedData;
}


function ReadTexCoords(contents) {
    const vertLines = [];
    for (const str of contents) {
        const re = new RegExp("vt");
        if (re.exec(str)) vertLines.push(str);
    }

    return new Float32Array(CleanData(vertLines));
}

function GetFileContents() {
    const contents = `
# Blender 5.3.0
# www.blender.org
mtllib cub.mtl
o Cube
v 1.000000 1.000000 -1.000000
v 1.000000 -1.000000 -1.000000
v 1.000000 1.000000 1.000000
v 1.000000 -1.000000 1.000000
v -1.000000 1.000000 -1.000000
v -1.000000 -1.000000 -1.000000
v -1.000000 1.000000 1.000000
v -1.000000 -1.000000 1.000000
vn -0.0000 1.0000 -0.0000
vn -0.0000 -0.0000 1.0000
vn -1.0000 -0.0000 -0.0000
vn -0.0000 -1.0000 -0.0000
vn 1.0000 -0.0000 -0.0000
vn -0.0000 -0.0000 -1.0000
vt 0.625000 0.500000
vt 0.875000 0.500000
vt 0.875000 0.750000
vt 0.625000 0.750000
vt 0.375000 0.750000
vt 0.625000 1.000000
vt 0.375000 1.000000
vt 0.375000 0.000000
vt 0.625000 0.000000
vt 0.625000 0.250000
vt 0.375000 0.250000
vt 0.125000 0.500000
vt 0.375000 0.500000
vt 0.125000 0.750000
s 0
usemtl Material
f 1/1/1 5/2/1 7/3/1 3/4/1
f 4/5/2 3/4/2 7/6/2 8/7/2
f 8/8/3 7/9/3 5/10/3 6/11/3
f 6/12/4 2/13/4 4/5/4 8/14/4
f 2/13/5 1/1/5 3/4/5 4/5/5
f 6/11/6 5/10/6 1/1/6 2/13/6

    `;


    const splitContents = contents.split(/\r?\n|\r|\n/g);
    return splitContents;
}

export function ReadObj(path) {
    const contents = GetFileContents();
    const verts = ReadVerticies(contents);
    const texCoords = ReadTexCoords(contents);
    const indicies = ReadIndicies(contents);
    return {
        verts: verts,
        texCoords: texCoords,
        indicies: indicies
    };
}