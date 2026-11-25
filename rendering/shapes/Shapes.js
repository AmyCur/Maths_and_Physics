import { GetCube } from "./Cube.js";
import {TypeUtil} from "../../util/TypeUtil.js";

export function GetShape(shape){
    
    // Check if its a string
    if(!TypeUtil.IsTargetType(shape, "")) console.error(`${shape} is not string`);

    shape=shape.toLowerCase();
    
    switch(shape){
        case "cube":
            return GetCube();
        default:
            console.error(`${shape} does not exist!`);
            return null;
        
    }
}