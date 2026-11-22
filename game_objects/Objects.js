
//? Vital object that contains all of the buffers


export class Objects {
    enemies =   [];
    static =    [];
    other =     [];
    colliders = [];
    floor =     null;

    GetAllColliderObjects(){
        let colObjs = [];
        const allObj = this.GetAllObjects();
        for(let obj of allObj){
            if(obj.components.collider !== undefined){
                colObjs.push(obj);
            }
        }

        return colObjs;
    }

    RemoveItemFromArray(item, array){
        const index = array.indexOf(item);
        if(index > -1)return array.splice(index, 1);
        return array;
    }

    GetAllRaycastableObjects(){
        const raycastables = [];
        const allObjs = this.GetAllObjects();
        
        for(let obj of allObjs){
            if(obj["properties"].raycastable === true) raycastables.push(obj);
        }

        return raycastables;
    }

    GetAllObjects(){
        return this.enemies.concat(this.static, this.other, this.colliders);
    }
}

export const objects = new Objects();