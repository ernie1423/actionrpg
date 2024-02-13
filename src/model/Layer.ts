import Matter from "matter-js";
import { Entity } from "./Entity";
import { CollisionCategories, config } from "../config";
import * as PIXI from "pixi.js";

export class Layer {
    entities: Entity[]
    engine: Matter.Engine
    visuals: PIXI.Container
    width: number
    height: number
    
    constructor(width: number, height: number){
        this.entities = [];
        
        this.engine = Matter.Engine.create({
            gravity: Matter.Vector.create(0, 0)
        })

        this.width = width;
        this.height = height;

        this.visuals = new PIXI.Container();
        const borderGraphics = new PIXI.Graphics();
        
        borderGraphics.beginFill(0x111111)
        borderGraphics.drawRect(0, 0, width, height)

        this.visuals.addChild(borderGraphics);
        
        [
            Matter.Bodies.rectangle(width/2, 0, width, 1),
            Matter.Bodies.rectangle(width/2, height, width, 1),
            Matter.Bodies.rectangle(0, height/2, 1, height),
            Matter.Bodies.rectangle(width, height/2, 1, height)
        ].forEach(w => {
            Matter.Body.setStatic(w, true)
            w.collisionFilter.category = CollisionCategories.Wall; 
            Matter.Composite.add(this.engine.world, w)
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
        
        if(entity.visuals)
            this.visuals.addChild(entity.visuals)
    }

    remove(entity: Entity){
        this.entities.splice(this.entities.findIndex(e => e == entity), 1)
        
        if(entity.body)
            Matter.Composite.remove(this.engine.world, entity.body);
        
        if(entity.visuals)
            this.visuals.removeChild(entity.visuals)
    }
}