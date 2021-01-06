import KeyboardController from './KeyboardController';
import './styles/stage.scss';
import bg1 from './images/bg1.png';
import bg2 from './images/bg2.png';
import {findSubarrays, getRandomInteger, mapIntToColor, removeElementsByClass, sleep, transpose} from './utils';

export default class Stage {
    constructor(num) {
    
        if(num > 88){
            throw new Error('Number of viruses cannot be bigger than 88');
        }
        this.num = num;
        this.setupContainer();
        this.setupGrid();
        this.setupKeyboard();
        this.setupBoard();
        this.setupThrow();
        setTimeout(() => {
            console.log('throw');
            this.throw();
            
        }, 2000);
    }
    
    setupContainer(){
        this.container = document.createElement('div');
        this.container.classList.add('stageContainer');
        this.container.style.backgroundImage = `url(${bg1})`;
    }
    
    render() {
        return this.container;
    }
    
    setupGrid() {
        this.grid = document.createElement('div');
        this.grid.classList.add('stageGrid');
        
        for(let x = 0; x < 10; x++){
            for(let y = 0; y < 18; y++){
                let cell = document.createElement('div');
                cell.classList.add('stageGridCell');
                cell.style.top = y*16 + 'px';
                cell.style.left = x*16 + 'px';
                this.grid.appendChild(cell);
                cell.innerText = `${x},${y}`;
            }
        }
        
        this.container.appendChild(this.grid);
    }
    
    setupBoard() {
        this.cells = new Array(10).fill(null).map(t => new Array(18).fill(null));
        for(let i = 0; i <= 17; i++){
            this.cells[0][i] = {x: 0, y: i, type: 'wall'}
            this.cells[9][i] = {x: 9, y: i, type: 'wall'}
        }
        for(let i = 0; i <= 9; i++){
            this.cells[i][0] = {x: i, y: 0, type: 'wall'}
            this.cells[i][17] = {x: i, y: 17, type: 'wall'}
        }
        this.cells[4][0] = null;
        this.cells[5][0] = null;
        for (let i = 0; i < this.num; i++) {
            let found = false;
            while(!found){
                let randX = getRandomInteger(1,8);
                let randY = getRandomInteger(6,16);
                if(!this.cells[randX][randY]){
                    found = true;
                    this.cells[randX][randY] = {
                        x: randX,
                        y: randY,
                        type: 'virus',
                        color: i%3,
                    }
                }
            }

        }
        // console.log(this.cells);
        this.draw();
    }
    
    setupKeyboard() {
        this.keyboardController = new KeyboardController(this.container);
        
        this.keyboardController.addListener('ArrowLeft', 'down', () => {
            console.log('Move Left');
            if(!this.pill?.control) return;
            
            const {x,y, rot} = this.pill;
            if(this.cells[x-1]?.[y]
            || (rot === 1 && this.cells[x-1]?.[y-1])){
                return;
            }
            
            this.pill.x -= 1;
            
            this.draw();
        })
    
        this.keyboardController.addListener('ArrowRight', 'down', () => {
            console.log('Move Right');
            if(!this.pill.control) return;
    
            const {x,y, rot} = this.pill;
            if(this.cells[x+1]?.[y]
                || (rot === 0 && this.cells[x+2]?.[y])
                || (rot === 1 && this.cells[x+1]?.[y-1])){
                return;
            }
    
            this.pill.x += 1;
            
            this.draw();
        })
    
        this.keyboardController.addListener('ArrowUp', 'down', () => {
            console.log('Rotate Left');
            if(!this.pill.control) return;
            
            const {x,y, rot} = this.pill;
            
            if((rot===0 && this.cells[x]?.[y-1])){
                return;
            }
            
            if((rot === 1 && this.cells[x+1]?.[y])){
                if(!this.cells[x-1][y]){
                    this.pill.x -= 1;
                }else{
                    return;
                }
            }
            
            this.pill.rot = (this.pill.rot + 1) % 2;
            
            if(this.pill.rot === 0){
                [this.pill.colorA, this.pill.colorB] = [this.pill.colorB, this.pill.colorA];
            }
            
            this.draw();
        })
    
        this.keyboardController.addListener('Shift', 'down', () => {
            console.log('Rotate Right');
            if(!this.pill.control) return;
    
            const {x,y, rot} = this.pill;
    
            if((rot===0 && this.cells[x]?.[y-1])){
                return;
            }
    
            if((rot === 1 && this.cells[x+1]?.[y])){
                if(!this.cells[x-1][y]){
                    this.pill.x -= 1;
                }else{
                    return;
                }
            }
    
            this.pill.rot = (this.pill.rot + 1) % 2;
            
            if(this.pill.rot === 1){
                [this.pill.colorA, this.pill.colorB] = [this.pill.colorB, this.pill.colorA];
            }
            this.draw();
        })
    
        this.keyboardController.addListener('ArrowDown', 'down', () => {
            console.log('Move Down');
            if(!this.pill.control) return;
            clearInterval(this.pill.interval);
            this.pill.control = false;
            this.pill.interval = setInterval(() => {
                this.fall();
            }, 50);
        })
    }
    
    draw() {
        removeElementsByClass('cellSprite');
        removeElementsByClass('pillSprite');
        
        this.cells.forEach((col, x) => {
            col.forEach((cell, y) => {
                this.drawSprite(cell);
            })
        })
        
        if(this.nextPill){
            this.drawPill(this.nextPill);
        }
        if(this.pill) {
            this.drawPill(this.pill);
        }
    }
    
    drawSprite(cell) {
        if(cell?.type === 'virus'){
            const virusEl = this.drawVirusCell(cell.color);
            virusEl.classList.add('cellSprite');
            virusEl.style.top = cell.y * 16 + 'px';
            virusEl.style.left = cell.x * 16 + 'px';
            if(cell.toDestroy){
                virusEl.classList.add('toDestroy');
            }
            this.grid.appendChild(virusEl);
        }else if(cell?.type === 'pill'){
            const pillEl = this.drawPillCell(cell.x, cell.y, cell.color, cell.id);
            pillEl.classList.add('cellSprite');
            pillEl.style.top = cell.y * 16 + 'px';
            pillEl.style.left = cell.x * 16 + 'px';
            if(cell.toDestroy){
                pillEl.classList.add('toDestroy');
            }
            this.grid.appendChild(pillEl);
        }
        else if(cell?.type === 'wall'){
            const wallEl = document.createElement('div');
            wallEl.classList.add('cellSprite');
            wallEl.style.top = cell.y * 16 + 'px';
            wallEl.style.left = cell.x * 16 + 'px';
            if(cell.toDestroy){
                wallEl.classList.add('toDestroy');
            }
            this.grid.appendChild(wallEl);
        }
    }
    
    drawVirusCell(color){
        const el = document.createElement('div');
        el.classList.add('virus')
        el.classList.add(`virus${mapIntToColor(color)}`)
        return el;
    }
    
    drawPillCell(x, y, color, id){
        const el = document.createElement('div');
        el.classList.add('pillCell');
        el.classList.add(`pillCell${mapIntToColor(color)}`);
        if(this.cells[x+1]?.[y]?.id === id){
            el.classList.add('pillCellRight');
        }else if(this.cells[x-1]?.[y]?.id === id){
            el.classList.add('pillCellLeft');
        }else if(this.cells[x]?.[y+1]?.id === id){
            el.classList.add('pillCellDown');
        }else if(this.cells[x]?.[y-1]?.id === id){
            el.classList.add('pillCellUp');
        }
        return el;
    }
    
    drawPill(pill) {
        const pillEl = document.createElement('div');
        pillEl.classList.add('pillSprite');
        pillEl.style.top = pill.y*16 + 'px';
        pillEl.style.left = pill.x*16 + 'px';
        
        const pillCellA = document.createElement('div');
        pillCellA.classList.add('pillPart', 'pillPartA');
        pillEl.appendChild(pillCellA);
        pillCellA.classList.add(`pillPart${mapIntToColor(pill.colorA)}`);
        pillCellA.style.top = '0px';
        pillCellA.style.left = '0px';
        
        const pillCellB = document.createElement('div');
        pillCellB.classList.add('pillPart', 'pillPartB');
        pillEl.appendChild(pillCellB)
        pillCellB.classList.add(`pillPart${mapIntToColor(pill.colorB)}`);
        
        
        if(pill.rot === 0){
            pillCellB.style.top = '0px';
            pillCellB.style.left = '16px';
            pillEl.classList.add('pillRight');
        }else{
            pillCellB.style.top = '-16px';
            pillCellB.style.left = '0px';
            pillEl.classList.add('pillTop');
        }
        
        this.grid.appendChild(pillEl);
    }
    
    setupThrow() {
        this.pillId = (this.pillId ?? 0) + 1;
        this.nextPill = {
            x: 14,
            y: -2,
            rot: 0,
            colorA: getRandomInteger(0,2),
            colorB: getRandomInteger(0,2),
            id: this.pillId,
            control: false,
        }
        this.draw();
        // console.log(this.nextPill);
    }
    
    async throw() {
        this.pill = {...this.nextPill};
        this.nextPill = null;
        // do async animation
        const ANIM_FRAME = 20;
        
        this.pill = {...this.pill, x: 14, y: -2, rot: 0};
        this.draw();
        await sleep(ANIM_FRAME);
        this.pill = {...this.pill, x: 14, y: -2, rot: 1};
        this.draw();
        await sleep(ANIM_FRAME);
    
        [this.pill.colorA, this.pill.colorB] = [this.pill.colorB, this.pill.colorA];
        this.pill = {...this.pill, x: 13, y: -3, rot: 0};
        this.draw();
        await sleep(ANIM_FRAME);
        this.pill = {...this.pill, x: 13, y: -3, rot: 1};
        this.draw();
        await sleep(ANIM_FRAME);
    
        [this.pill.colorA, this.pill.colorB] = [this.pill.colorB, this.pill.colorA];
        this.pill = {...this.pill, x: 12, y: -4, rot: 0};
        this.draw();
        await sleep(ANIM_FRAME);
        this.pill = {...this.pill, x: 12, y: -4, rot: 1};
        this.draw();
        await sleep(ANIM_FRAME);
    
        [this.pill.colorA, this.pill.colorB] = [this.pill.colorB, this.pill.colorA];
        this.pill = {...this.pill, x: 11, y: -4, rot: 0};
        this.draw();
        await sleep(ANIM_FRAME);
        this.pill = {...this.pill, x: 11, y: -4, rot: 1};
        this.draw();
        await sleep(ANIM_FRAME);
    
        [this.pill.colorA, this.pill.colorB] = [this.pill.colorB, this.pill.colorA];
        this.pill = {...this.pill, x: 10, y: -4, rot: 0};
        this.draw();
        await sleep(ANIM_FRAME);
        this.pill = {...this.pill, x: 10, y: -4, rot: 1};
        this.draw();
        await sleep(ANIM_FRAME);
    
        [this.pill.colorA, this.pill.colorB] = [this.pill.colorB, this.pill.colorA];
        this.pill = {...this.pill, x: 9, y: -4, rot: 0};
        this.draw();
        await sleep(ANIM_FRAME);
        this.pill = {...this.pill, x: 9, y: -4, rot: 1};
        this.draw();
        await sleep(ANIM_FRAME);
    
        [this.pill.colorA, this.pill.colorB] = [this.pill.colorB, this.pill.colorA];
        this.pill = {...this.pill, x: 8, y: -4, rot: 0};
        this.draw();
        await sleep(ANIM_FRAME);
        this.pill = {...this.pill, x: 8, y: -4, rot: 1};
        this.draw();
        await sleep(ANIM_FRAME);
    
        [this.pill.colorA, this.pill.colorB] = [this.pill.colorB, this.pill.colorA];
        this.pill = {...this.pill, x: 7, y: -4, rot: 0};
        this.draw();
        await sleep(ANIM_FRAME);
        this.pill = {...this.pill, x: 7, y: -4, rot: 1};
        this.draw();
        await sleep(ANIM_FRAME);
    
        [this.pill.colorA, this.pill.colorB] = [this.pill.colorB, this.pill.colorA];
        this.pill = {...this.pill, x: 6, y: -4, rot: 0};
        this.draw();
        await sleep(ANIM_FRAME);
        this.pill = {...this.pill, x: 6, y: -4, rot: 1};
        this.draw();
        await sleep(ANIM_FRAME);
    
        [this.pill.colorA, this.pill.colorB] = [this.pill.colorB, this.pill.colorA];
        this.pill = {...this.pill, x: 5, y: -3, rot: 0};
        this.draw();
        await sleep(ANIM_FRAME);
        this.pill = {...this.pill, x: 5, y: -3, rot: 1};
        this.draw();
        await sleep(ANIM_FRAME);
    
        [this.pill.colorA, this.pill.colorB] = [this.pill.colorB, this.pill.colorA];
        this.pill = {...this.pill, x: 4, y: -3, rot: 0};
        this.draw();
        await sleep(ANIM_FRAME);
        this.pill = {...this.pill, x: 4, y: -2, rot: 0};
        this.draw();
        await sleep(ANIM_FRAME);
        this.pill = {...this.pill, x: 4, y: -1, rot: 0};
        this.draw();
        await sleep(ANIM_FRAME);
        this.pill = {...this.pill, x: 4, y: 0, rot: 0};
        this.draw();
        await sleep(ANIM_FRAME);
        
        this.pill = {
            ...this.pill,
            x: 4,
            y: 1,
            rot: 0, // 0 - right, 1 - top
            control: true,
            interval: setInterval(() => {
                this.fall();
            }, 600),
        }
        this.draw();
        this.setupThrow();
    }
    
    async fall() {
        const {x, y} = this.pill;
        
        if(this.cells[x]?.[y+1]
        || (this.pill.rot===0 && this.cells[x+1]?.[y+1])){
            // block movement
            this.pill.control = false;
            clearInterval(this.pill.interval)
            // console.log('STOP');
            this.placePill();
            // await sleep(2000);
            await this.destroy();
            
            await this.throw();
        }else{
            this.pill.y += 1;
        }
        
        this.draw();
    }
    
    
    placePill() {
        const {x, y, id, colorA, colorB, rot} = this.pill;
        this.cells[x][y] = {
            type: 'pill',
            x: x,
            y: y,
            color: colorA,
            id: id,
        };
        
        const bx = rot === 0 ? x + 1 : x
        const by = rot === 1 ? y - 1 : y
    
        // console.log(x,y);
        // console.log(bx,by);
        
        this.cells[bx][by] = {
            type: 'pill',
            x: bx,
            y: by,
            color: colorB,
            id: id,
        };
        
        this.pill = null;
        
        this.draw();
    }
    
    
    async destroy() {
    
        // console.log('DESTROYING');
        
        let found = new Array(10).fill(null).map(t => new Array(18).fill(null));
        
        
        for(let i = 0; i <= 9; i++){
            const col = this.cells[i];
            let find = findSubarrays(col, 4, (el => el && el.color === 0));
            find.forEach((v, j) => found[i][j] = v ? 1 : found[i][j]);
            find = findSubarrays(col, 4, (el => el && el.color === 1));
            find.forEach((v, j) => found[i][j] = v ? 1 : found[i][j]);
            find = findSubarrays(col, 4, (el => el && el.color === 2));
            find.forEach((v, j) => found[i][j] = v ? 1 : found[i][j]);
        }
        
        
        let transposedCells = transpose(this.cells);
    
    
        for(let i = 0; i <= 17; i++){
            const row = transposedCells[i];
            let find = findSubarrays(row, 4, (el => el && el.color === 0));
            find.forEach((v, j) => found[j][i] = v ? 1 : found[j][i]);
            find = findSubarrays(row, 4, (el => el && el.color === 1));
            find.forEach((v, j) => found[j][i] = v ? 1 : found[j][i]);
            find = findSubarrays(row, 4, (el => el && el.color === 2));
            find.forEach((v, j) => found[j][i] = v ? 1 : found[j][i]);
        }
        
        let destroyed = false;
    
        this.cells.forEach((col, x) => {
            col.forEach((cell, y) => {
                if(found[x][y] === 1){
                    if(cell) {
                        destroyed = true;
                        cell.toDestroy = true;
                    }
                }
            })
        })
        
        if(destroyed){
            // console.log('DESTROYED');
            this.draw();
    
            await sleep(200);
    
            this.cells.forEach((col, x) => {
                col.forEach((cell, y) => {
                    if(found[x][y] === 1){
                        if(cell) {
                            this.cells[x][y] = null;
                        }
                    }
                })
            })
    
            this.draw();
            
            await sleep(200);
            
            this.drop();
            
        }
        
        await sleep(1000);
    }
    
    
    async drop() {
        
        const dropCell = (x,y) => {
            let cell = {...this.cells[x][y]};
            cell.y += 1;
            this.cells[x][y] = null;
            this.cells[x][y+1] = cell;
        }
        
        let checkDestroy = false;
    
        let dropped = true;
        
        while(dropped) {
            let anythingDropped = false;
            
            for(let y = 17; y >= 0; y--){
                for(let x = 0; x <= 9; x++){
                    if(this.cells[x][y]?.type === 'pill'
                    && !this.cells[x][y+1]){
                        if(this.cells[x+1][y]?.id === this.cells[x][y]?.id){
                            if(!this.cells[x+1][y+1]){
                                dropCell(x,y);
                                anythingDropped = true;
                            }
                        }else if(this.cells[x-1][y]?.id === this.cells[x][y]?.id){
                            if(!this.cells[x-1][y+1]){
                                dropCell(x,y);
                                anythingDropped = true;
                            }
                        }else{
                            dropCell(x,y);
                            anythingDropped = true;
                        }
                    }
                }
            }
            
            if(!anythingDropped){
                dropped = false;
            }else{
                checkDestroy = true;
            }
            
            this.draw();
            
            await sleep(100);
        }
        
        if(checkDestroy){
            await sleep(200);
            await this.destroy();
        }
    
    }
}
