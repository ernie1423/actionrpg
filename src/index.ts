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
import { Gun } from './content/Gun';

const layers = [new Layer(500, 500), new Layer(1000, 100), new Layer(800, 800)]

function linkLayers(l1: Layer, p1: Matter.Vector, l2: Layer, p2: Matter.Vector){
    l1.add(new Portal(
        p1,
        [l2, p2]
    ))
    l2.add(new Portal(
        p2,
        [l1, p1]
    ))
}

linkLayers(
    layers[0],
    Matter.Vector.create(450, 250),
    layers[1],
    Matter.Vector.create(50, 50)
)

linkLayers(
    layers[0],
    Matter.Vector.create(250, 50),
    layers[2],
    Matter.Vector.create(400, 750)
)
for(let i = 10; i--; i > 0){
    layers[2].add(new ExampleUnit(
        Matter.Vector.create(400 + (Math.random() * 50 - 100), 400 + (Math.random() * 50 - 100))
    ))
}

let currentLayer = layers[0];

export const app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0x161616,
    antialias: true
})

const mouse = {
    held: false,
    position: {
        x: 0,
        y: 0
    }
}

document.body.appendChild(app.view as HTMLCanvasElement)

console.log("abob", document.querySelector("canvas"))

document.querySelector("canvas")!.addEventListener("mousedown", e => {
    console.log("held")
    mouse.held = true;
})
document.querySelector("canvas")!.addEventListener("mousemove", e => {
    mouse.position.x = e.x;
    mouse.position.y = e.y;
})

document.querySelector("canvas")!.addEventListener("mouseup", e => {
    mouse.held = false;
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

    if(mouse.held && player.inventory.equippedWeapon){
        console.log("c")
        let x = mouse.position.x - app.screen.width/2;
        let y = mouse.position.y - app.screen.height/2;

        player.inventory.equippedWeapon.use(Matter.Vector.create(x, y));
    }
}, 1000/60);

currentLayer.add(player)
currentLayer.add(new ExampleUnit(Matter.Vector.create(90, 50)))
currentLayer.add(new ExampleUnit(Matter.Vector.create(50, 90)))
currentLayer.add(new DroppedItem(Matter.Vector.create(0, 0), new Component({ name: "A-component", trueName: "componentA", amount: 30 })))
currentLayer.add(new DroppedItem(Matter.Vector.create(0, 0), new Component({ name: "B-component", trueName: "componentB", amount: 30 })))
currentLayer.add(new DroppedItem(Matter.Vector.create(0, 0), new Gun({ name: "weapon", trueName: "weapon" })))

console.log(currentLayer.visuals.children)

app.stage.addChild(LayerVisuals);
app.stage.addChild(UI);

app.stage.addChild(inventory.visuals);
app.stage.addChild(focusedTooltip.visuals);
