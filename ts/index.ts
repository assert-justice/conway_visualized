function drawLineHoriz(sim: Sim, x: number, y: number, length: number){
    for(let i = 0; i < length; i++){
        if(onGrid(sim, x + i, y)){
            sim.setCell(x + i, y, true);
        }
        else{
            break;
        }
    }
}

function onGrid(sim: Sim, x: number, y: number): boolean{
    // given an x and y coord, return whether or not it is on the grid
    return x < sim.width && x >= 0 && y < sim.height && y >= 0;
}

function drawBox(sim: Sim, x: number, y: number, width: number, height: number){
    for(let i = 0; i < width; i++){
        for(let j = 0; j < height; j++){
            if(onGrid(sim, x + i, y + j)){
                sim.setCell(x + i, y + j, true);
            }
        }
    }
}
function drawNegBox(sim: Sim, x: number, y: number, width: number, height: number){
    for(let i = 0; i < width; i++){
        for(let j = 0; j < height; j++){
            if(onGrid(sim, x + i, y + j)){
                const value = sim.getCell(x + i, y + j);
                sim.setCell(x + i, y + j, !value);
            }
        }
    }
}

function safeSet(sim: Sim, x: number, y: number, value: boolean){
    if(onGrid(sim, x, y)){
        sim.setCell(x, y, value);
    }
}

function drawBoxEmpty(sim: Sim, x: number, y: number, width: number, height: number){
    for(let i = 0; i < width; i++){
        safeSet(sim, x + i, y, true);
        safeSet(sim, x + i, y + height - 1, true);
    }
    for(let i = 0; i < height; i++){
        safeSet(sim, x, y + i, true);
        safeSet(sim, x + width - 1, y + i, true);
    }
}

function countNeighbors(sim: Sim, x: number, y: number): number{
    //
    // for(let i = 0; i < )
    let adj = 0;
    // if(onGrid(sim, x - 1, y - 1) && sim.getCell(x - 1, y - 1)) adj++;
    for(let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){
            if(i === 0 && j === 0) continue;
            const cx = x + i;
            const cy = y + j;
            if(onGrid(sim, cx, cy) && sim.getCell(cx, cy)) adj++;
        }
    }
    return adj;
}

// let x = 0;
// let y = 0;

// if a cell is alive and has less than 2 or more than 3 neighbors it dies
// if a cell is dead and has 3 living neighbors it becomes alive

function main(){
    const sim = new Sim(30, 30);
    sim.step = () => {
        const flips: [number,number][] = [];
        for(let x = 0; x < sim.width; x++){
            for(let y = 0; y < sim.height; y++){
                const adj = countNeighbors(sim, x, y);
                const alive = sim.getCell(x, y);
                if(alive){
                    if(adj < 2 || adj > 3){
                        // cell dies
                        flips.push([x,y]);
                    }
                }
                else{
                    if (adj === 3){
                        // cell lives
                        flips.push([x,y]);
                    }
                }
            }
        }
        
        for (const [x, y] of flips) {
            sim.setCell(x, y, !sim.getCell(x, y));
        }
        
    }
}

window.onload = main;