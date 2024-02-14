import Matter from "matter-js";
import { Entity } from "../model/Entity";
import { CollisionCategories } from "../config";
import * as PIXI from "pixi.js"
import { Layer } from "../model/Layer";

export class Box extends Entity {
    visuals: PIXI.Container
    body: Matter.Body

    constructor(position: Matter.Vector, width: number, height: number) {
        super();
        
        const b = Matter.Bodies.rectangle(position.x, position.y, width, height);
        this.body = b;

        b.collisionFilter.category = CollisionCategories.Unit;
        b.collisionFilter.mask = CollisionCategories.Unit | CollisionCategories.Wall;
        
        this.visuals = new PIXI.Container();
        const g = new PIXI.Graphics();
        g.beginFill(0xFFFFFF);
        g.drawRect(0, 0, width, height);
        this.visuals.addChild(g);
    }

    update(layer: Layer): void {
        console.log(this.body.position)
        this.visuals.position.set(this.body.position.x, this.body.position.y);
    }
}