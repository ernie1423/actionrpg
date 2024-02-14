import * as PIXI from 'pixi.js'
import { app, player } from '..';
import { Item, Weapon } from '../model/Item';
import { focusedTooltip } from '.';

console.log(player)

const itemSize = 100;

export class InventoryMenu {
    visuals: PIXI.Container
    items: Item[]

    get visible(): boolean {
        return this.visuals.renderable;
    }

    set visible(v) {
        this.visuals.renderable = v;
    }

    constructor(){
        this.visuals = new PIXI.Container();
        this.items = [];
    }

    update(){
        this.items = player.inventory.items;
        this.visuals.removeChildren();
        console.log(this.items)
        
        this.items.forEach((item, i) => {
            const p = new PIXI.Container()

            const g = new PIXI.Graphics();

            if(item == player.inventory.equippedWeapon)
                g.beginFill(0x4444AA, 0.5);
            else
                g.beginFill(0, 0.5);
            g.drawRect(0, 0, itemSize, itemSize);

            p.addChild(g)

            const s = PIXI.Sprite.from("assets/" + item.trueName + ".svg")
            
            s.width = itemSize;
            s.height = itemSize;

            p.addChild(s)

            p.setTransform((itemSize + 10) * i);

            this.visuals.addChild(p);
            
            p.eventMode = 'static';

            p.addEventListener('mousemove', e => {
                focusedTooltip.visuals.setTransform(e.x, e.y - focusedTooltip.visuals.height + 5);
                focusedTooltip.text = item.name;
                focusedTooltip.visible = true;
            })

            p.addEventListener('mouseleave', e => {
                focusedTooltip.visuals.setTransform(e.x, e.y - focusedTooltip.visuals.height + 5);
                focusedTooltip.text = item.name;
                focusedTooltip.visible = false;
            })

            p.addEventListener('click', e => {
                if(item instanceof Weapon){
                    if(player.inventory.equippedWeapon == item){
                        player.inventory.equippedWeapon = undefined;
                    }
                    else player.inventory.equippedWeapon = item;
                    this.update();
                }
            })

            p.addEventListener('rightclick', e => {
                player.inventory.dropItem(item)

                if(player.inventory.equippedWeapon == item)
                    player.inventory.equippedWeapon = undefined;

                focusedTooltip.visible = false;
                this.update();
            })
        });

        this.visuals.setTransform(app.screen.width/2 - this.visuals.width/2, app.screen.height/2 - 150)
    }
}