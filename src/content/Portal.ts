import Matter, { Query } from "matter-js";
import { player } from "..";
import { Entity } from "../model/Entity";
import { Layer } from "../model/Layer";
import * as PIXI from "pixi.js";
import { CollisionCategories } from "../config";
import { Unit } from "../model/Unit";

export class Portal extends Entity {
    visuals: PIXI.Container
    body: Matter.Body
    l?: Layer
    ready: boolean = false

    constructor(position: Matter.Vector, to: [Layer, Matter.Vector]) {
        super();

        this.body = Matter.Bodies.circle(position.x, position.y, 30);
        this.body.collisionFilter.category = CollisionCategories.Ghost;
        this.body.collisionFilter.mask = 0;
        
        this.visuals = new PIXI.Container();

        const g = new PIXI.Graphics();
        g.beginFill(0x88AA88, 0.7);
        g.drawCircle(0, 0, 30);
        g.endFill()

        this.visuals.addChild(g);

        this.visuals.eventMode = 'static';

        this.visuals.addEventListener('click', e => {
            if(this.l && this.ready){
                this.l.remove(player);
                to[0].add(player);
                Matter.Body.setPosition(player.body, to[1]);
            }
        })

        this.visuals.position.set(this.body.position.x, this.body.position.y);
    }

    update(layer: Layer){
        this.l = layer;

        this.visuals.position.set(this.body.position.x, this.body.position.y);
        
        let units = layer.entities.filter(e => e instanceof Unit) as Unit[];
        let collisions = Query.collides(this.body, units.map(u => u.body));
        
        units = units.filter(u => collisions.some(c => c.bodyB == u.body && c.collided));

        if(units.some(u => player)){
            this.ready = true;
        }
        else this.ready = false;
    }
}