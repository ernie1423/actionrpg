export class KeyboardControls {
    keys: Map<string, boolean>
    keysDuration: Map<string, number>

    constructor(){
        this.keys = new Map();
        this.keysDuration = new Map();
        
        document.body.addEventListener("keydown", e => {
            this.keys.set(e.code, true)
        })

        document.body.addEventListener("keyup", e => {
            this.keys.set(e.code, false)
        })
    }

    update(){
        this.keys.forEach((pressed, keyName) => {
            let n = this.keysDuration.get(keyName) || 0;

            this.keysDuration.set(keyName, pressed ? n + 1 : 0);
        });
    }
}