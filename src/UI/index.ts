import { InventoryMenu } from "./Inventory";
import { SmallTooltip } from "./Tooltip";

export let focusedTooltip = new SmallTooltip("")
focusedTooltip.visible = false;

export let inventory = new InventoryMenu();
inventory.visible = false;