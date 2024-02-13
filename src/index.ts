import Matter from 'matter-js';
import { ExampleUnit } from './content/ExampleUnit';
import { Layer } from './model/Layer';
import * as PIXI from 'pixi.js'

const l = new Layer(250, 250);

const app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0x161616,
    antialias: true
})
const inspected = new ExampleUnit(Matter.Vector.create(90, 90), Matter.Vector.create(1, 1));

setInterval(() => {
    l.update();
    l.visuals.setTransform(-inspected.visuals.position.x + app.screen.width/2, -inspected.visuals.position.y + app.screen.height/2)
}, 1000/60);

l.add(new ExampleUnit(Matter.Vector.create(90, 50), Matter.Vector.create(1, 0)))
l.add(inspected)
l.add(new ExampleUnit(Matter.Vector.create(50, 90), Matter.Vector.create(0, 1)))

app.stage.addChild(l.visuals);

document.body.appendChild(app.view as HTMLCanvasElement)