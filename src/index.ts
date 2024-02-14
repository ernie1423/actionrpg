import Matter from 'matter-js';
import { ExampleUnit } from './content/ExampleUnit';
import { Layer } from './model/Layer';
import * as PIXI from 'pixi.js'
import { Player } from './content/Player';
import { KeyboardControls } from './controls';
import { Explosion } from './content/Explosion';
import { focusedTooltip, inventory } from './UI';
import { Component, DroppedItem, Item, Weapon } from './model/Item';
import { Portal } from './content/Portal';
import { Box } from './content/box';

const layers = [new Layer(500, 500), new Layer(1000, 100)]

layers[0].add(new Portal(
    Matter.Vector.create(450, 250),
    [layers[1], Matter.Vector.create(50, 50)]
))
layers[1].add(new Portal(
    Matter.Vector.create(50, 50),
    [layers[0], Matter.Vector.create(450, 250)]
))
// layers[0].add(new Box(
//     Matter.Vector.create(250, 100),
//     95, 95
// ))

let currentLayer = layers[0];

export const app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0x161616,
    antialias: true
})

const LayerVisuals = new PIXI.Container();

const UI = new PIXI.Container();

const controls = new KeyboardControls();

export const player = new Player(Matter.Vector.create(250, 250));

const cameraScale = 2;

function changeLayer(nl: Layer){
    LayerVisuals.removeChildren();
    LayerVisuals.addChild(nl.visuals);

    currentLayer = nl;
}

changeLayer(currentLayer)

setInterval(() => {
    let l = layers.find(l => l.entities.some(e => e == player));
    if(l && l != currentLayer)
        changeLayer(l as Layer);

    player.movementDirection.x = (+(controls.keys.get("KeyA") || 0)) * -1 + (+(controls.keys.get("KeyD") || 0)) * 1
    player.movementDirection.y = (+(controls.keys.get("KeyW") || 0)) * -1 + (+(controls.keys.get("KeyS") || 0)) * 1

    currentLayer.update();

    currentLayer.visuals.setTransform(-player.visuals.position.x * cameraScale + app.screen.width/2, -player.visuals.position.y * cameraScale + app.screen.height/2)

    currentLayer.visuals.scale.set(cameraScale, cameraScale);

    controls.update();

    if(controls.keysDuration.get("KeyI") == 1){
        inventory.visible = !inventory.visible
    }

    if(controls.keysDuration.get("KeyQ") == 1)
        console.log(player.body.position)
}, 1000/60);

currentLayer.add(player)
currentLayer.add(new ExampleUnit(Matter.Vector.create(90, 50)))
currentLayer.add(new ExampleUnit(Matter.Vector.create(50, 90)))
currentLayer.add(new DroppedItem(Matter.Vector.create(0, 0), new Component({ name: "component alpha", trueName: "ComponentA", amount: 30 })))
currentLayer.add(new DroppedItem(Matter.Vector.create(0, 0), new Component({ name: "component beta", trueName: "ComponentB", amount: 30 })))
currentLayer.add(new DroppedItem(Matter.Vector.create(0, 0), new Weapon({ name: "weapon", trueName: "ComponentB" })))

console.log(currentLayer.visuals.children)
setInterval(() => {
    currentLayer.add(new Explosion(Matter.Vector.create(400, 400), 50));
}, 1000);

app.stage.addChild(LayerVisuals);
app.stage.addChild(UI);

app.stage.addChild(inventory.visuals);
app.stage.addChild(focusedTooltip.visuals);

document.body.appendChild(app.view as HTMLCanvasElement)