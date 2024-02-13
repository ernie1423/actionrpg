import * as PIXI from "pixi.js";
import { Effect } from "./Effect";
import { Entity } from "./Entity";
import { Layer } from "./Layer";
import { Body } from "matter-js";

export class Health {
    value: number
    max: number
    
    constructor(value: number){
        this.value = value;
        this.max = value;
    }

    static update(h: Health){
        if(h.value > h.max)
            h.value = h.max
    }
}

export class Attribute {
    initialValue: number
    value: number

    constructor(value: number){
        this.initialValue = value;
        this.value = value;
    }

    static update(a: Attribute){
        a.value = a.initialValue;
    }
}

export abstract class Ability<U extends Unit> {
    unit?: U
    layer?: Layer
    
    constructor(){

    }

    update(u: U, l: Layer){
        this.unit = u
        this.layer = l
    }
}

export enum AttributeNames {
    MovementSpeed = "movement-speed"
}

export abstract class Unit extends Entity {
    health: Health
    effects: Effect[]
    private attributes: Map<AttributeNames, Attribute>
    abilities: Ability<Unit & unknown>[]
    visuals: PIXI.Container
    body: Body;
    
    constructor(b: Matter.Body, health: Health){
        super(b);

        this.body = b;
        this.health = health;
        this.attributes = new Map();
        this.effects = [];
        this.abilities = [];
        this.visuals = new PIXI.Container();
    }

    getAttributes(): ReadonlyMap<AttributeNames, Attribute> {
        return this.attributes;
    }

    update(layer: Layer) {
        super.update(layer);

        this.attributes.forEach(a => {
            Attribute.update(a);
        })

        this.effects.forEach((e, i) => {
            if(e.beingRemoved)
                this.effects.splice(i, 1);
            e.update(this, layer);
        })

        this.abilities.forEach(a => {
            a.update(this, layer);
        })

        Health.update(this.health);

        this.visuals.position.set(this.body.position.x, this.body.position.y);
    }
}