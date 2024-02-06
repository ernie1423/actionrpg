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

export abstract class Action<U extends Unit> {
    unit?: U
    layer?: Layer
    
    constructor(){

    }

    update(u: U, l: Layer){
        this.unit = u
        this.layer = l
    }

    use(u: U, l: Layer){
        
    }
}

export class Behavior<U extends Unit> {
    private actionPool: Action<U>[]

    constructor(){
        this.actionPool = [];
    }

    update(knownData: any){

    }

    pullActions(): Action<U>[] {
        const result = this.actionPool.concat();
        this.actionPool = [];

        return result;
    }
}

export abstract class Unit extends Entity {
    behavior?: Behavior<unknown & Unit>
    health: Health
    attributes: Map<string, Attribute>
    effects: Effect[]
    
    constructor(b: Matter.Body, health: Health){
        super(b);

        this.health = health;
        this.attributes = new Map();
        this.effects = [];
    }

    update(layer: Layer) {
        super.update(layer);

        this.effects.forEach((e, i) => {
            e.update(this, layer);
            if(e.beingRemoved)
                this.effects.splice(i, 1);
        })

        Health.update(this.health);

        this.attributes.forEach(a => {
            Attribute.update(a);
        })
    }
}