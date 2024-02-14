import Matter from "matter-js";
import { Entity } from "./Entity";
import { Layer } from "./Layer";
import * as PIXI from "pixi.js";
import { CollisionCategories } from "../config";
import { Unit } from "./Unit";

// 1. Оружие
// 2. Расходники
// 3. Компоненты для крафта
// 4. Экипировка

export interface ItemOptions {
    name: string
}

export abstract class Item {
    protected unit?: Unit
    protected layer?: Layer
    name: string

    constructor(options: ItemOptions) {
        this.name = options.name;
    }

    update(u: Unit, l: Layer){
        this.unit = u;
        this.layer = l;
    }
}

type ComponentOptions = ItemOptions & {
    amount: number
}

export class Component extends Item {
    static stack: number
    amount: number
    
    constructor(options: ComponentOptions){
        super(options);
        this.amount = options.amount;
    }
}

export enum WeaponAttributeNames {
    Damage = "damage",
    Cooldown = "cooldown"
}

export class Weapon extends Item {
    attributes: Map<WeaponAttributeNames, number>

    constructor(options: ItemOptions){
        super(options);

        this.attributes = new Map();
    }

    use(target: Matter.Vector){
        
    }
}

export class DroppedItem extends Entity {
    visuals: PIXI.Container
    body: Matter.Body
    item: Item

    constructor(position: Matter.Vector, item: Item){
        super();

        this.body = Matter.Bodies.circle(position.x, position.y, 12);
        this.body.collisionFilter.category = CollisionCategories.Item;
        this.body.collisionFilter.mask = CollisionCategories.Wall | CollisionCategories.Item;

        this.visuals = new PIXI.Container();

        const g = new PIXI.Graphics();
        g.beginFill(0x000000, 200);
        g.drawCircle(0, 0, 12);
        g.endFill();

        this.visuals.addChild(g);
        
        this.visuals.position.set(this.body.position.x, this.body.position.y);

        this.item = item;
    }

    update(layer: Layer): void {
        this.visuals.position.set(this.body.position.x, this.body.position.y);
    }
}