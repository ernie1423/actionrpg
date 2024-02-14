import Matter from "matter-js";
import { Entity } from "./Entity";
import { CollisionCategories, config } from "../config";
import * as PIXI from "pixi.js";
import { DroppedItem } from "./Item";

export const cellSize = 100;

export class Layer {
    entities: Entity[]
    engine: Matter.Engine
    visuals: PIXI.Container
    width: number
    height: number

    protected itemLayer: PIXI.Container
    
    constructor(width: number, height: number){
        this.entities = [];
        
        this.engine = Matter.Engine.create({
            gravity: Matter.Vector.create(0, 0)
        })

        this.width = width;
        this.height = height;

        this.visuals = new PIXI.Container();
        this.itemLayer = new PIXI.Container();

        const borderGraphics = new PIXI.Graphics();
        
        borderGraphics.beginFill(0x111111)
        borderGraphics.drawRect(0, 0, width, height)

        this.visuals.addChild(borderGraphics);
        
        for(let x = Math.ceil(width/cellSize) - 1; x >= 0; x--){
            for(let y = Math.ceil(height/cellSize) - 1; y >= 0; y--){
                if(Math.random() > 0.7){
                    const g = new PIXI.Graphics();
                    g.beginFill(0xFFFFFF, 0.05);
                    g.drawRect(cellSize * 0.2 + cellSize * x, cellSize * 0.2 + cellSize * y, cellSize * 0.6, cellSize * 0.6)
                    g.endFill();

                    this.visuals.addChild(g);
                }
            }
        }
        
        this.visuals.addChild(this.itemLayer);
        
        [
            Matter.Bodies.rectangle(width/2, -250, width+1000, 500),
            Matter.Bodies.rectangle(width/2, height+250, width+1000, 500),
            Matter.Bodies.rectangle(-250, height/2, 500, height+1000),
            Matter.Bodies.rectangle(width+250, height+250, 500, height+1000),
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
        
        if(entity.visuals){
            if(entity instanceof DroppedItem){
                this.itemLayer.addChild(entity.visuals);
                console.log("Added item visuals")
            }
            else this.visuals.addChild(entity.visuals);
        }
    }

    remove(entity: Entity){
        this.entities.splice(this.entities.findIndex(e => e == entity), 1)
        
        if(entity.body)
            Matter.Composite.remove(this.engine.world, entity.body);
        
        if(entity.visuals){
            if(entity instanceof DroppedItem)
                this.itemLayer.removeChild(entity.visuals);
            else this.visuals.removeChild(entity.visuals)
        }
    }
}