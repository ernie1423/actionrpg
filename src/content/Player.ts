import Matter from "matter-js";
import { Attribute, AttributeNames, Health, Unit } from "../model/Unit";
import * as PIXI from "pixi.js";
import { MovementAbility } from "./MovementAbility";
import { Layer } from "../model/Layer";
import { DroppedItem, Item, Weapon } from "../model/Item";

const size = 10;
const health = 10;

export class Inventory {
    unit?: Unit
    layer?: Layer
    items: Item[]

    equippedWeapon?: Weapon
    
    constructor(){
        this.items = [];
    }

    update(u: Unit, l: Layer){
        this.items.forEach(i => {
            i.update(u, l);
        })

        this.unit = u;
        this.layer = l;
    }

    removeItem(i: Item){
        this.items.forEach((item, key) => {
            if(i == item)
                this.items.splice(key, 1);
        })
    }

    dropItem(i: Item): boolean {
        if(!this.layer) return false;
        if(!this.unit) return false;
        
        this.removeItem(i);
        this.layer.add(new DroppedItem(this.unit.body.position, i));

        return true;
    }
}

export class Player extends Unit {
    abilities: [MovementAbility];
    movementDirection: Matter.Vector
    inventory: Inventory

    constructor(position: Matter.Vector){
        const body = Matter.Bodies.circle(position.x, position.y, size);

        super(body, new Health(health));
        
        const g = new PIXI.Graphics();
        g.beginFill(0xFFFFFF);
        g.drawCircle(0, 0, size);
        g.endFill();

        this.visuals.addChild(g);

        this.abilities = [new MovementAbility()];

        this.attributes.set(AttributeNames.MovementSpeed, new Attribute(0.5));

        this.movementDirection = Matter.Vector.create(0, 0);

        this.inventory = new Inventory();
    }

    update(layer: Layer): void {
        super.update(layer);
        this.abilities[0].move(this.movementDirection);
    }
}