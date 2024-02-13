import Matter from "matter-js";
import * as PIXI from "pixi.js";
import { Health, Unit } from "../model/Unit";
import { Layer } from "../model/Layer";

const size = 10;
const health = 10;

export class ExampleUnit extends Unit {
    constructor(position: Matter.Vector) {
        const body = Matter.Bodies.circle(position.x, position.y, size);
        
        super(body, new Health(health));
        
        const g = new PIXI.Graphics();
        g.beginFill(0xFFFFFF);
        g.drawCircle(0, 0, size);
        g.endFill();
        this.visuals.addChild(g);
    }

    update(layer: Layer): void {
        super.update(layer);
    }
}