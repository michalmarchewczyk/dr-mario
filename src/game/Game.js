import '../styles/game.scss';
import bg_intro from '../images/bg_intro_animated.png';
import bg_menu from '../images/bg_menu.png';
import KeyboardController from '../utils/KeyboardController';
import Stage from '../stage/Stage';
import LEVELS from './levels';
import Counter from '../utils/Counter';
import select_lvl from '../images/menu_select_lvl.png';
import select_speed from '../images/menu_select_speed.png';
import select_music from '../images/menu_select_music.png';
import StorageVariable from '../utils/StorageVariable';
import {sleep} from '../utils/utils';

export default class Game {
    constructor() {
        this.setupContainer();
        this.keyboardController = new KeyboardController(this.container);
        this.viewIntro();
        this.selectedLvl = 0;
        this.selectedSpeed = 0;
        this.currentScore = 0;
        this.topScore = new StorageVariable('topScore', 100);
    }

    setupContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('gameContainer');
    }

    render() {
        return this.container;
    }

    async viewIntro() {
        this.container.style.backgroundImage = `url(${bg_intro})`;
        this.container.style.backgroundPosition = '-18px -50px';
        let selectedMultiplayer = false;
        let multiplayerArrow = document.createElement('div');
        multiplayerArrow.classList.add('multiplayerArrow');
        this.container.appendChild(multiplayerArrow);
        if (selectedMultiplayer) {
            multiplayerArrow.style.top = '272px';
        } else {
            multiplayerArrow.style.top = '240px';
        }
        await sleep(200);
        this.keyboardController.addListener('ArrowDown', 'down', () => {
            selectedMultiplayer = !selectedMultiplayer;
            if (selectedMultiplayer) {
                multiplayerArrow.style.top = '272px';
            } else {
                multiplayerArrow.style.top = '240px';
            }
        })
        this.keyboardController.addListener('ArrowUp', 'down', () => {
            selectedMultiplayer = !selectedMultiplayer;
            if (selectedMultiplayer) {
                multiplayerArrow.style.top = '272px';
            } else {
                multiplayerArrow.style.top = '240px';
            }
        })
        this.keyboardController.addListener('Enter', 'up', () => {
            this.viewMenu();
        })
        this.keyboardController.addListener('ArrowRight', 'up', () => {
            this.viewMenu();
        })
    }


    async viewMenu() {
        this.keyboardController.clearListeners();
        this.keyboardController.focus();
        this.container.innerHTML = '';
        this.container.style.backgroundImage = `url(${bg_menu})`;
        this.container.style.backgroundPosition = '0 0';

        this.selectedControl = 0;
        this.selectArrow = document.createElement('div');
        this.selectArrow.classList.add('selectArrow');
        this.container.appendChild(this.selectArrow);

        const updateSelect = () => {
            if (this.selectedControl === 0) {
                this.selectArrow.style.top = 32 + 'px';
                this.selectArrow.style.backgroundImage = `url(${select_lvl})`;
            } else if (this.selectedControl === 1) {
                this.selectArrow.style.top = 144 + 'px';
                this.selectArrow.style.backgroundImage = `url(${select_speed})`;
            } else {
                this.selectArrow.style.top = 256 + 'px';
                this.selectArrow.style.backgroundImage = `url(${select_music})`;
            }
        }

        updateSelect();

        this.lvlCounter = new Counter(2, this.selectedLvl);
        this.lvlCounter.el.classList.add('lvlCounter');
        this.container.appendChild(this.lvlCounter.render());

        this.lvlArrow = document.createElement('div');
        this.lvlArrow.classList.add('lvlArrow');
        this.lvlArrow.style.left = 160 + this.selectedLvl * 16 + 'px';
        this.container.appendChild(this.lvlArrow);

        this.speedArrow = document.createElement('div');
        this.speedArrow.classList.add('speedArrow');
        this.speedArrow.style.left = 224 + this.selectedSpeed * 96 + 'px';
        this.container.appendChild(this.speedArrow);

        await sleep(200);

        this.keyboardController.addListener('Enter', 'up', () => {
            this.startGame();
        })

        this.keyboardController.addListener('ArrowDown', 'down', () => {
            this.selectedControl = Math.min(2, this.selectedControl + 1);
            updateSelect();
        });

        this.keyboardController.addListener('ArrowUp', 'down', () => {
            this.selectedControl = Math.max(0, this.selectedControl - 1);
            updateSelect();
        });

        this.keyboardController.addListener('ArrowRight', 'down', () => {
            if (this.selectedControl !== 0) return;
            this.selectedLvl = Math.min(20, this.selectedLvl + 1);
            this.lvlArrow.style.left = 160 + this.selectedLvl * 16 + 'px';
            this.lvlCounter.set(this.selectedLvl);
        });

        this.keyboardController.addListener('ArrowLeft', 'down', () => {
            if (this.selectedControl !== 0) return;
            this.selectedLvl = Math.max(0, this.selectedLvl - 1);
            this.lvlArrow.style.left = 160 + this.selectedLvl * 16 + 'px';
            this.lvlCounter.set(this.selectedLvl);
        });

        this.keyboardController.addListener('ArrowRight', 'down', () => {
            if (this.selectedControl !== 1) return;
            this.selectedSpeed = Math.min(2, this.selectedSpeed + 1);
            this.speedArrow.style.left = 224 + this.selectedSpeed * 96 + 'px';
        });

        this.keyboardController.addListener('ArrowLeft', 'down', () => {
            if (this.selectedControl !== 1) return;
            this.selectedSpeed = Math.max(0, this.selectedSpeed - 1);
            this.speedArrow.style.left = 224 + this.selectedSpeed * 96 + 'px';
        });

    }

    startGame() {
        this.currentLevel = this.selectedLvl;
        this.currentScore = 0;
        this.startStage();
    }


    startStage() {
        this.keyboardController.clearListeners();
        this.container.innerHTML = '';
        let level = LEVELS[this.currentLevel];
        let stage = new Stage(level.id, level.viruses, this.selectedSpeed, level.bg, level.bgImg, this.currentScore, this.topScore.value, this.stageWin.bind(this), this.stageLose.bind(this));
        this.container.appendChild(stage.render());
    }


    stageWin(score) {
        this.currentScore += score;
        this.currentLevel += 1;
        this.startStage();
    }


    stageLose(score) {
        this.currentScore += score;
        this.topScore.value = Math.max(this.topScore.value, this.currentScore);
        this.viewMenu();
    }
}
