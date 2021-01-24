export default class KeyboardController {
    
    constructor(attach = document.body) {
        this.attach = attach;
        this.listeners = [];
        this.setup();
    }
    
    setup() {
        this.attach.tabIndex = 0;
        this.attach.autofocus = true;
        this.attach.focus();
        window.requestAnimationFrame(() => {
            this.attach.focus()
        })
        this.attach.addEventListener('keydown', (e) => {
            e.preventDefault();
            // console.log(e.key);
            this.listeners
                .filter(l => l.type === 'press')
                .filter(l => l.key === e.key)
                .forEach(listener => {
                    listener.callback();
                });
            this.listeners
                .filter(l => l.type === 'down')
                .filter(l => !l.pressed)
                .filter(l => l.key === e.key)
                .forEach(listener => {
                    listener.pressed = true;
                    listener.callback();
                });
        });
        this.attach.addEventListener('keyup', (e) => {
            e.preventDefault();
            // console.log(e.key);
            this.listeners
                .filter(l => l.type === 'up')
                .filter(l => l.key === e.key)
                .forEach(listener => {
                    listener.callback();
                });
            this.listeners
                .filter(l => l.type === 'down')
                .filter(l => l.pressed)
                .filter(l => l.key === e.key)
                .forEach(listener => {
                    listener.pressed = false;
                });
        });
    }
    
    addListener(key, type = 'down', callback) {
        this.listeners.push({
            key,
            callback,
            type
        });
    }
    
    clearListeners(){
        this.listeners = [];
    }
}
