
//? Vital object that contains all of the buffers

export const objects = {
    enemies: [],
    static: [],
    other: [],
    colliders: [],

    IsEnemy(object){
        return object["components"].enemy !== undefined;
    }
}