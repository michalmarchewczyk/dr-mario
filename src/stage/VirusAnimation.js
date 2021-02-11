import '../styles/VirusAnimation.scss';
import {deepCopy, rotateArray} from "../utils/utils";


let imgUrls = [
    'bl', 'bl_dead', 'bl_lose',
    'br', 'br_dead', 'br_lose',
    'yl', 'yl_dead', 'yl_lose',
]

let imgs = {};

imgUrls.forEach(img => {
    import(`../images/viruses/${img}.png`).then((module) => {
        imgs[img] = module.default;
    });
});

let positions = [
    {x: 5, y: 7},
    {x: 1, y: 4},
    {x: 6, y: 2},

    {x: 6, y: 7},
    {x: 1, y: 5},
    {x: 5, y: 2},

    {x: 7, y: 6},
    {x: 2, y: 6},
    {x: 4, y: 2},

    {x: 7, y: 5},
    {x: 2, y: 7},
    {x: 3, y: 2},

    {x: 7, y: 4},
    {x: 3, y: 7},
    {x: 2, y: 3},

    {x: 7, y: 3},
    {x: 4, y: 7},
    {x: 1, y: 4},


    {x: 6, y: 2},
    {x: 5, y: 7},
    {x: 1, y: 4},

    {x: 5, y: 2},
    {x: 6, y: 7},
    {x: 1, y: 5},

    {x: 4, y: 2},
    {x: 7, y: 6},
    {x: 2, y: 6},

    {x: 3, y: 2},
    {x: 7, y: 5},
    {x: 2, y: 7},

    {x: 2, y: 3},
    {x: 7, y: 4},
    {x: 3, y: 7},

    {x: 1, y: 4},
    {x: 7, y: 3},
    {x: 4, y: 7},


    {x: 1, y: 4},
    {x: 6, y: 2},
    {x: 5, y: 7},

    {x: 1, y: 5},
    {x: 5, y: 2},
    {x: 6, y: 7},

    {x: 2, y: 6},
    {x: 4, y: 2},
    {x: 7, y: 6},

    {x: 2, y: 7},
    {x: 3, y: 2},
    {x: 7, y: 5},

    {x: 3, y: 7},
    {x: 2, y: 3},
    {x: 7, y: 4},

    {x: 4, y: 7},
    {x: 1, y: 4},
    {x: 7, y: 3},

]


class VirusAnimation {
    constructor() {
        this.positions = deepCopy(positions);
        this.update({});
        this.setupContainer();

    }

    setupContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('virusesContainer');

        this.blVirus = document.createElement('div');
        this.blVirus.classList.add('blVirus');
        this.container.appendChild(this.blVirus);

        this.brVirus = document.createElement('div');
        this.brVirus.classList.add('brVirus');
        this.container.appendChild(this.brVirus);

        this.ylVirus = document.createElement('div');
        this.ylVirus.classList.add('ylVirus');
        this.container.appendChild(this.ylVirus);

        this.rotateInterval = setInterval(() => {
            this.rotate();
        }, 1000);
        this.rotate();

        this.animInterval = setInterval(() => {
            this.animate();
        }, 200);
        this.animate();
    }

    render() {
        return this.container;
    }

    update({bl = 1, br = 1, yl = 1}) {
        this.viruses = {bl, br, yl};
    }

    rotate() {

        if (Object.values(this.viruses).includes(-1)) {
            return;
        }


        this.positions = rotateArray(this.positions, 3);

        this.blVirus.style.left = this.positions[0].x * 16 + 'px';
        this.blVirus.style.top = this.positions[0].y * 16 + 'px';

        this.brVirus.style.left = this.positions[1].x * 16 + 'px';
        this.brVirus.style.top = this.positions[1].y * 16 + 'px';

        this.ylVirus.style.left = this.positions[2].x * 16 + 'px';
        this.ylVirus.style.top = this.positions[2].y * 16 + 'px';
    }

    animate() {
        if (this.viruses.bl > 0) {
            this.blVirus.style.backgroundImage = `url(${imgs.bl})`;
        } else if (this.viruses.bl === 0) {
            this.blVirus.style.backgroundImage = `url(${imgs.bl_dead})`;
        } else {
            this.blVirus.style.backgroundImage = `url(${imgs.bl_lose})`;
        }

        if (this.viruses.br > 0) {
            this.brVirus.style.backgroundImage = `url(${imgs.br})`;
        } else if (this.viruses.br === 0) {
            this.brVirus.style.backgroundImage = `url(${imgs.br_dead})`;
        } else {
            this.brVirus.style.backgroundImage = `url(${imgs.br_lose})`;
        }

        if (this.viruses.yl > 0) {
            this.ylVirus.style.backgroundImage = `url(${imgs.yl})`;
        } else if (this.viruses.yl === 0) {
            this.ylVirus.style.backgroundImage = `url(${imgs.yl_dead})`;
        } else {
            this.ylVirus.style.backgroundImage = `url(${imgs.yl_lose})`;
        }

    }
}

export default VirusAnimation;