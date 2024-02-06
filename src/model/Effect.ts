import { Layer } from "./Layer";
import { Unit } from "./Unit";

export abstract class Effect {
    beingRemoved: boolean

    constructor(){
        this.beingRemoved = false;
    }

    update(u: Unit, l: Layer){
        
    }
}