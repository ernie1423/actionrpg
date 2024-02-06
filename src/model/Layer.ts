import Matter from "matter-js";
import { Entity } from "./Entity";
import { config } from "../config";

export class Layer {
    entities: Entity[]
    engine: Matter.Engine
    
    constructor(){
        this.entities = [];
        
        this.engine = Matter.Engine.create({
            gravity: Matter.Vector.create(0, 0)
        })    
    }

    update(){
        for(const entity of this.entities){
            entity.update(this);
        }
        
        Matter.Engine.update(this.engine, 1000/config.tps)
    }

    add(entity: Entity){
        this.entities.push(entity);
        
        if(entity.body)
            Matter.Composite.add(this.engine.world, entity.body);
    }

    remove(entity: Entity){
        this.entities.splice(this.entities.findIndex(e => e == entity), 1)
        
        if(entity.body)
            Matter.Composite.remove(this.engine.world, entity.body);
    }
}