import { Layer } from "./Layer";

export abstract class Entity {
    body?: Matter.Body
    
    constructor(b?: Matter.Body){
        this.body = b;
    }

    update(layer: Layer){

    }
}