import { Body, Vector } from "matter-js";
import { Ability, AttributeNames, Unit } from "../model/Unit";

export class MovementAbility extends Ability<Unit> {
    constructor() {
        super();
    }

    move(direction: Vector): void {
        if(!this.unit) return;

        const speed = this.unit.getAttributes().get(AttributeNames.MovementSpeed)?.value || 5;

        if(!this.unit.body.isStatic)
            Body.setVelocity(
                this.unit.body,
                Vector.mult(
                    Vector.normalise(direction),
                    speed
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