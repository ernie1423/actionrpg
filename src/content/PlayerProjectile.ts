import { Bodies, Body, Query, Vector } from "matter-js";
import { Entity } from "../model/Entity";
import { Layer } from "../model/Layer";
import { CollisionCategories } from "../config";
import * as PIXI from "pixi.js";
import { Unit } from "../model/Unit";

export class Projectile extends Entity {
    visuals: PIXI.Container
    body: Body
    done: boolean = false;
    velocity: Vector
    damage: number
    exceptions: Unit[]

    constructor(position: Vector, velocity: Vector, damage: number, exceptions: Unit[]){
        super();

        const b = Bodies.circle(position.x, position.y, 5);
        this.body = b;

        b.collisionFilter.category = CollisionCategories.Ghost;
        b.collisionFilter.mask = 0;

        this.visuals = new PIXI.Container();
        this.visuals.position.set(this.body.position.x, this.body.position.y);

        const g = new PIXI.Graphics();
        g.beginFill(0xFFAAAA);
        g.drawCircle(0, 0, 5);
        g.endFill();
        this.visuals.addChild(g);

        this.velocity = velocity;

        Body.setVelocity(this.body, velocity);
        this.body.frictionAir = 0;
        this.damage = damage;
        this.exceptions = exceptions
    }

    update(layer: Layer): void {
        super.update(layer);

        if(this.done){
            layer.remove(this);
            return;
        }

        let units = layer.entities.filter(e => e instanceof Unit) as Unit[];
        let collisions = Query.collides(this.body, units.map(u => u.body));
        
        units = units.filter(u => !this.exceptions.some(e => e == u) && collisions.some(c => c.bodyA == u.body && c.collided));

        units.forEach(u => {
            u.health.value -= this.damage;
            this.done = true;
        })

        this.visuals.position.set(this.body.position.x, this.body.position.y);
    }
}