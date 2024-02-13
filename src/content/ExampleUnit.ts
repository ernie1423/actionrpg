import Matter from "matter-js";
import * as PIXI from "pixi.js";
import { Ability, Health, Unit } from "../model/Unit";
import { MovementAbility } from "./MovementAbility";
import { Layer } from "../model/Layer";

const size = 10;
const health = 10;

export class ExampleUnit extends Unit {
    abilities: [MovementAbility];
    direction: Matter.Vector;
    done: boolean

    constructor(position: Matter.Vector, direction: Matter.Vector) {
        const body = Matter.Bodies.circle(position.x, position.y, size);
        const visuals = new PIXI.Container();
        const g = new PIXI.Graphics();
        g.beginFill(0xFFFFFF);
        g.drawCircle(0, 0, size);
        g.endFill();
        visuals.addChild(g);
        
        super(body, new Health(health));

        this.visuals = visuals;

        this.abilities = [new MovementAbility()];
        this.direction = direction;
        this.done = false;
    }

    update(layer: Layer): void {
        super.update(layer);

        if(!this.done){
            this.abilities[0].move(this.direction);
            //this.done = false;
        }
    }
}