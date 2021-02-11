import '../styles/Counter.scss';

class Counter {
    constructor(len = 2, val = 0) {
        this.el = document.createElement('div');
        this.el.classList.add('Counter');
        this.len = len;
        this.el.style.width = this.len * 16 + 'px';
        this.set(val);
    }

    set(val) {
        this.val = val;
        this.el.innerHTML = '';
        for (let i = 0; i < this.len; i++) {
            let digit = Math.floor((this.val / Math.pow(10, i)) % 10);
            let img = document.createElement('div');
            img.classList.add('digit');
            img.classList.add(`digit-${digit}`);
            this.el.appendChild(img);
        }
    }

    render() {
        return this.el;
    }
}

export default Counter;
