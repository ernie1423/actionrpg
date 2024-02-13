import { Effect } from "../model/Effect";
import { Layer } from "../model/Layer";
import { Unit } from "../model/Unit";

export class HealthChangeEffect extends Effect {
    delta: number

    constructor(delta: number) {
        super();
        
        this.delta = delta;
    }

    update(u: Unit, l: Layer): void {
        u.health.value += this.delta;
        this.beingRemoved = true;
    }
}