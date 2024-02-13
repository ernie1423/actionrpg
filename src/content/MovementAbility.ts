import { Body, Vector } from "matter-js";
import { Ability, AttributeNames, Unit } from "../model/Unit";
import { Layer } from "../model/Layer";

export class MovementAbility extends Ability<Unit> {
    isAvailable: boolean

    constructor() {
        super();

        this.isAvailable = true;
    }

    update(u: Unit, l: Layer): void {
        super.update(u, l);
        this.isAvailable = true;
    }

    move(direction: Vector): void {
        if(!this.isAvailable) return;
        if(!this.unit) return;
        if(!direction.x && !direction.y) return;

        this.isAvailable = false;

        const speed = this.unit.getAttributes().get(AttributeNames.MovementSpeed)?.value || 0.5;

        if(!this.unit.body.isStatic)
            Body.setVelocity(
                this.unit.body,
                Vector.add(
                    this.unit.body.velocity,
                    Vector.mult(
                        Vector.normalise(direction),
                        speed
                    )
                )
            )
        else {
            Body.translate(
                this.unit.body,
                Vector.mult(
                    Vector.normalise(direction),
                    speed
                )
            )
        }
    }
}