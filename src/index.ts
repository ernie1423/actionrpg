import * as PIXI from 'pixi.js'

const app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0x161616
})

const g = new PIXI.Graphics();
g.beginFill(0xFFFFFF);
g.drawRect(0, 0, 100, 100);
g.endFill();

app.stage.addChild(g);

document.body.appendChild(app.view as HTMLCanvasElement)