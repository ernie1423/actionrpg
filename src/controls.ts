export class KeyboardControls {
    keys: Map<string, boolean>

    constructor(){
        this.keys = new Map();
        
        document.body.addEventListener("keydown", e => {
            this.keys.set(e.code, true)
        })

        document.body.addEventListener("keyup", e => {
            this.keys.set(e.code, false)
        })
    }
}