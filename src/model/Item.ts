import Matter from "matter-js";
import { Entity } from "./Entity";
import { Layer } from "./Layer";
import * as PIXI from "pixi.js";
import { CollisionCategories } from "../config";
import { Unit } from "./Unit";
import { focusedTooltip, inventory } from "../UI";
import { player } from "..";

// 1. Оружие
// 2. Расходники
// 3. Компоненты для крафта
// 4. Экипировка

export interface ItemOptions {
    name: string
    trueName: string
}

export abstract class Item {
    protected unit?: Unit
    protected layer?: Layer
    name: string
    trueName: string

    constructor(options: ItemOptions) {
        this.name = options.name;
        this.trueName = options.trueName;
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

let alreadyLoaded: string[] = []

export class DroppedItem extends Entity {
    visuals: PIXI.Container
    body: Matter.Body
    item: Item
    beingRemoved: boolean = false;

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
        g.beginFill(0x666666, 255);
        g.drawPolygon([-6, -3, 6, -3, 0, 6])
        g.endFill();

        this.visuals.addChild(g);

        this.visuals.position.set(this.body.position.x, this.body.position.y);

        this.item = item;

        this.visuals.eventMode = 'static';

        this.visuals.addEventListener('mousemove', e => {
            focusedTooltip.visuals.setTransform(e.x, e.y - focusedTooltip.visuals.height + 5);
            focusedTooltip.text = this.item.name;
            focusedTooltip.visible = true;
        })

        this.visuals.addEventListener('mouseleave', e => {
            focusedTooltip.visuals.setTransform(e.x, e.y - focusedTooltip.visuals.height + 5);
            focusedTooltip.text = this.item.name;
            focusedTooltip.visible = false;
        })

        this.visuals.addEventListener('click', e => {
            this.beingRemoved = true;
            focusedTooltip.visible = false;
        })
    }

    update(layer: Layer): void {
        this.visuals.position.set(this.body.position.x, this.body.position.y);

        if(this.beingRemoved){
            player.inventory.items.push(this.item);
            inventory.update();
            layer.remove(this);
        }
    }
}