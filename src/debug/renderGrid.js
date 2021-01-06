
const renderGrid = (size = 32, opacity = 0.4) => {
    const grid = document.createElement('div');
    grid.style.position = 'absolute';
    grid.style.zIndex = '1000000';
    grid.style.width = '100vw';
    grid.style.height = '100vh';
    grid.style.opacity = opacity.toString();
    
    let sizeX = window.innerWidth / size;
    let sizeY = window.innerHeight / size;
    
    for(let x = 0; x < sizeX; x++){
        for(let y = 0; y < sizeY; y++){
            let cell = document.createElement('div');
            cell.style.position = 'absolute';
            cell.style.width = size + 'px';
            cell.style.height = size + 'px';
            cell.style.top = y*size + 'px';
            cell.style.left = x*size + 'px';
            // cell.style.borderRight = '1px solid black';
            // cell.style.borderBottom = '1px solid black';
            cell.style.border = '1px solid black';
            grid.appendChild(cell);
        }
    }
    
    
    return grid;
}


export default renderGrid;
