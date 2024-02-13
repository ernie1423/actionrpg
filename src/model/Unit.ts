import { Effect } from "./Effect";
import { Entity } from "./Entity";
import { Layer } from "./Layer";

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

    use(){
        
    }
}

export abstract class Unit extends Entity {
    health: Health
    effects: Effect[]
    private attributes: Map<string, Attribute>
    abilities: Ability<Unit & unknown>[]
    
    constructor(b: Matter.Body, health: Health){
        super(b);

        this.health = health;
        this.attributes = new Map();
        this.effects = [];
        this.abilities = [];
    }

    getAttributes(): ReadonlyMap<string, Attribute> {
        return this.attributes;
    }

    update(layer: Layer) {
        super.update(layer);

        this.attributes.forEach(a => {
            Attribute.update(a);
        })

        this.effects.forEach((e, i) => {
            e.update(this, layer);
            if(e.beingRemoved)
                this.effects.splice(i, 1);
        })

        this.abilities.forEach(a => {
            a.update(this, layer);
        })

        Health.update(this.health);
    }
}