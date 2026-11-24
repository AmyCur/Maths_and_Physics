import { MeshCreator } from "../rendering/BufferManager";
import {Mesh} from "./Mesh";
import { objects } from "./Objects";

export class Button extends Mesh{
    
    parent;

    constructor(func, bufferData, transform, components = {}, properties = Mesh.defaultProperties(), buffers){
        super(bufferData, transform, components, properties, buffers);
        
        this.func=func;
        this.parent=MeshCreator.CreateMesh(player.gl, bufferData, components, properties, transform);
        objects.other.push(this.parent);
    }

    PressButton(){
        this.func();
    }
}