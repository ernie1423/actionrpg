import Matter from "matter-js";
import { ItemOptions, Weapon, WeaponAttributeNames } from "../model/Item";
import { Projectile } from "./PlayerProjectile";
import { Unit } from "../model/Unit";
import { Layer } from "../model/Layer";

export class Gun extends Weapon {
    cooldown: number = 0;

    constructor(options: ItemOptions){
        super(options);
        
        this.attributes.set(WeaponAttributeNames.Cooldown, 30);
        this.attributes.set(WeaponAttributeNames.Damage, 5);
    }

    update(u: Unit, l: Layer): void {
        super.update(u, l)
        if(this.cooldown >= 1)
            this.cooldown--;
    }

    use(target: Matter.Vector){
        if(this.cooldown == 0){
            this.cooldown = this.attributes.get(WeaponAttributeNames.Cooldown) as number

            const velocity = Matter.Vector.mult(Matter.Vector.normalise(target), 3)

            this.layer?.add(new Projectile(this.unit!.body.position, velocity, this.attributes.get(WeaponAttributeNames.Damage) as number, [this.unit as Unit]))
        }
    }
}