class GameObject{
    constructor(data, position={x:0,y:0,z:0}, scale={x:1,y:1,z:1}){
        this.data=data;
        this.baseData=this.data;
        this.position=position;
        this.scale=scale;
        this.ScaleAndPositionData(this.baseData);
    }

    ScaleAndPositionData(baseData){
        this.data=baseData;
        for(let [index, value] of this.data.entries()){
            if(index==0 || (index) % 3 == 0){
                this.data[index]= baseData[index]+this.position.x;
                this.data[index]= baseData[index]*this.scale.x; 
            } 
            if(index==1 || (index-1) % 3 == 0){
                this.data[index]=baseData[index]+this.position.y;
                this.data[index]=baseData[index]*this.scale.y; 
            } 
            else if(index==1 || (index-2) % 3 == 0){
                this.data[index]=baseData[index]+this.position.z;
                this.data[index]=baseData[index]*this.scale.z; 
            } 
        }
    }

    SetScale(x,y,z){
        this.scale={
            x:x,
            y:y,
            z:z
        }

        this.ScaleAndPositionData(this.baseData);
    }

    SetPos(x,y,z){
        this.position = {x:x,y:y,z:z};
        this.ScaleAndPositionData(this.baseData);
    }

    AddPos(x,y,z){
        this.position = {
            x: this.position.x+x,
            y: this.position.y+y,
            z: this.position.z+z
        }
        this.ScaleAndPositionData(this.baseData);
    }
}