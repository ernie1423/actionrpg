import { Layer } from "./Layer";
import * as PIXI from "pixi.js";

export abstract class Entity {
    body?: Matter.Body
    visuals?: PIXI.Container
    
    constructor(b?: Matter.Body){
        this.body = b;
    }

    update(layer: Layer){

    }
}