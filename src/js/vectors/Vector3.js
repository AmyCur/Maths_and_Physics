class Vector3{
    ToVector2(vector) {
        return new Vector2(vector.x,vector.y);
    }

    constructor(x,y,z){
        this.x=x;
        this.y=y;
        this.z=z;
    }
}