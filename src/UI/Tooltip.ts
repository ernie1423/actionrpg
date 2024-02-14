import * as PIXI from "pixi.js"

export class SmallTooltip {
    visuals: PIXI.Container
    t: PIXI.Text
    g: PIXI.Graphics

    get text(): string {
        return this.t.text;
    }
    
    set text(v) {
        this.t.text = v;
        this.g.clear();

        this.g.beginFill(0, 210);

        this.g.drawRect(-10, -10, this.t.width + 20, this.t.height + 20);

        this.g.endFill();
    }

    get visible(): boolean {
        return this.visuals.renderable;
    }

    set visible(v) {
        this.visuals.renderable = v;
    }

    constructor(text: string){
        this.visuals = new PIXI.Container();

        this.g = new PIXI.Graphics();
        this.t = new PIXI.Text(text, {
            align: 'left',
            fontFamily: 'monospace',
            padding: 5,
            fontSize: 24,
            fill: '#FFFFFF'
        })

        this.g.beginFill(0, 210);

        this.g.drawRect(-10, -10, this.t.width + 20, this.t.height + 20);

        this.g.endFill();
        
        this.visuals.addChild(this.g);
        this.visuals.addChild(this.t);
    }
}