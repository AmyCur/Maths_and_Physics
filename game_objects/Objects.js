
//? Vital object that contains all of the objects


export class Objects {
    // Stores variables of type Mesh
    mesh = {
        enemies: [],
        static: [],
        other: [],

        GetAll(){
            return this.enemies.concat(this.static, this.other);
        }
    }

    // Stores variables of type TransObject
    trans = {
        // Player, camera and other required objects
        core: [],
        other: [],

        GetAll(){
            return this.core.concat(this.other);
        }

    }

    GetAllColliderObjects() {
        let colObjs = [];
        const allObj = this.GetAllTransObjects();
        for (let obj of allObj) {
            if (obj.components.collider !== undefined) {
                colObjs.push(obj);
            }
        }

        return colObjs;
    }

    RemoveItemFromArray(item, array) {
        const index = array.indexOf(item);
        if (index > -1) return array.splice(index, 1);
        return array;
    }

    GetAllRaycastableObjects() {
        const raycastables = [];
        const allObjs = this.GetAllTransObjects();

        for (let obj of allObjs) {
            if (obj["properties"].raycastable === true) raycastables.push(obj);
        }

        return raycastables;
    }

    GetAllTransObjects(){
        const allMesh = this.mesh.GetAll();
        const allTrans = this.trans.GetAll();

        return allMesh.concat(allTrans);
    }

    MoveAllObjects(){
        const all = this.GetAllTransObjects();
        for(let obj of all){
            obj.HandleVelocity();
        }
    }
    
}

export const objects = new Objects();