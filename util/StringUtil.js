export class StringUtil{
      TruncateComponent(com){
        return com.toString().substring(0, 4);
    }
    constructor(){}
}

export const SUtil = new StringUtil();