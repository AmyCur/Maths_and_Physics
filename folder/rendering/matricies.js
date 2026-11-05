function GetIdentityMatrix(){
    const f32Array = new Float32Array([
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    ])

    return DOMMatrix.fromFloat32Array(f32Array);
}

function GetZeroMatrix(){
    const f32Array = new Float32Array([
        0,0,0,0,
        0,0,0,0,
        0,0,0,0,
        0,0,0,0
    ]);

    return DOMMatrix.fromFloat32Array(f32Array);
}

function TranslateMatrix(matrix, translation){
    matrix[3]+=translation.x;
    matrix[7]+=translation.y;
    matrix[11]+=translation.z;

    return matrix;
}

function GetPerspectiveMatrix(fovy, aspectRatio, nearDistance,farDistance){
    const mat = GetZeroMatrix();

    const f = 1/Math.tan(fovy/2);
    mat[0] = f/aspectRatio;
    mat[5] = f;
    mat[11] = -1;
    
    if(farDistance!=null){
        const nf = 1/(nearDistance-farDistance);
        mat[10]=farDistance*nf;
        mat[14] = farDistance*nearDistance*nf;
    }
    else{
        mat[10]=-1;
        mat[14]=-nearDistance;
    }

    return mat;
}

export { GetIdentityMatrix, GetPerspectiveMatrix, TranslateMatrix };