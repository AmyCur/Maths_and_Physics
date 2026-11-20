
//? Vital object that contains all of the buffers

export const objects = {
    enemies: [],
    static: [],
    other: [],
    colliders: [],

    GetAllColliderObjects(){
        let colObjs = [];
        const allObj = this.GetAllObjects();
        for(let obj of allObj){
            if(obj["components"]?.collider !== undefined){
                colObjs.push(obj);
            }
        }

        return colObjs;
    },

    GetAllRaycastableObjects(){
        const raycastables = [];
        const allObjs = this.GetAllObjects();
        
        for(let obj of allObjs){
            if(obj["properties"].raycastable === true) raycastables.push(obj);
        }

        return raycastables;
    },

    GetAllObjects(){
        return this.enemies.concat(this.static, this.other, this.colliders);
    }


}