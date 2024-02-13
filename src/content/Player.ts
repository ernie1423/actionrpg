import Matter from "matter-js";
import { Attribute, AttributeNames, Health, Unit } from "../model/Unit";
import * as PIXI from "pixi.js";
import { MovementAbility } from "./MovementAbility";
import { Layer } from "../model/Layer";

const size = 10;
const health = 10;

export class Player extends Unit {
    abilities: [MovementAbility];
    movementDirection: Matter.Vector

    constructor(position: Matter.Vector){
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

        this.attributes.set(AttributeNames.MovementSpeed, new Attribute(2));

        this.movementDirection = Matter.Vector.create(0, 0);
    }

    update(layer: Layer): void {
        super.update(layer);
        this.abilities[0].move(this.movementDirection);
    }
}