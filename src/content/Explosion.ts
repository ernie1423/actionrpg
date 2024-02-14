import { Bodies, Body, Query, Vector } from "matter-js";
import { Entity } from "../model/Entity";
import { Layer } from "../model/Layer";
import { CollisionCategories } from "../config";
import * as PIXI from "pixi.js";
import { Unit } from "../model/Unit";

class Particle {

}

export class Explosion extends Entity {
    visuals: PIXI.Container
    body: Body
    force: number
    done: boolean = false;
    animMaxFrame = 60;

    constructor(position: Vector, force: number){
        super();

        const b = Bodies.circle(position.x, position.y, force);
        this.force = force;
        this.body = b;

        b.collisionFilter.category = CollisionCategories.Ghost;
        b.collisionFilter.mask = 0;

        this.visuals = new PIXI.Container();
        this.visuals.position.set(this.body.position.x, this.body.position.y);

        const g = new PIXI.Graphics();
        g.beginFill(0xFF0000);
        g.drawCircle(0, 0, force);
        g.endFill();
        this.visuals.addChild(g);
    }

    update(layer: Layer): void {
        super.update(layer);

        if(this.done){
            layer.remove(this);
            return;
        }

        let units = layer.entities.filter(e => e instanceof Unit) as Unit[];
        let collisions = Query.collides(this.body, units.map(u => u.body));
        
        units = units.filter(u => collisions.some(c => c.bodyA == u.body && c.collided));

        units.forEach(u => {
            u.health.value -= this.force/10;
            let force = Vector.sub(u.body.position, this.body.position);
            force = Vector.normalise(force);
            force = Vector.mult(force, this.force * 0.8)

            Body.setVelocity(
                u.body,
                Vector.add(u.body.velocity, force)
            )
        })

        this.done = true;

        this.visuals.position.set(this.body.position.x, this.body.position.y);
    }
}