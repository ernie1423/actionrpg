import Matter from 'matter-js';
import { ExampleUnit } from './content/ExampleUnit';
import { Layer } from './model/Layer';
import * as PIXI from 'pixi.js'
import { Player } from './content/Player';
import { KeyboardControls } from './controls';
import { Explosion } from './content/Explosion';
import { DroppedItem } from './model/Item';

const l = new Layer(500, 500);

const app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0x161616,
    antialias: true
})

const controls = new KeyboardControls();

const player = new Player(Matter.Vector.create(250, 250));

const cameraScale = 2

setInterval(() => {
    player.movementDirection.x = (+(controls.keys.get("KeyA") || 0)) * -1 + (+(controls.keys.get("KeyD") || 0)) * 1
    player.movementDirection.y = (+(controls.keys.get("KeyW") || 0)) * -1 + (+(controls.keys.get("KeyS") || 0)) * 1

    l.update();

    l.visuals.setTransform(-player.visuals.position.x * cameraScale + app.screen.width/2, -player.visuals.position.y * cameraScale + app.screen.height/2)

    l.visuals.scale.set(cameraScale, cameraScale)
}, 1000/60);

l.add(player)
l.add(new ExampleUnit(Matter.Vector.create(90, 50)))
l.add(new ExampleUnit(Matter.Vector.create(50, 90)))

console.log(l.visuals.children)
setInterval(() => {
    l.add(new Explosion(Matter.Vector.create(400, 400), 50));
}, 1000);

app.stage.addChild(l.visuals);

document.body.appendChild(app.view as HTMLCanvasElement)