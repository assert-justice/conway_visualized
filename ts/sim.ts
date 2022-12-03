class Sim {
    splotch: Splotch;
    private data: boolean[];
    private lastMousePos = {
        x: 0,
        y: 0,
    }
    private _width: number;
    get width(){return this._width;}
    private _height: number;
    get height(){return this._height;}

    private calcIdx(x: number, y: number): number{
        if(x < 0 || y < 0 || x >= this.splotch.width || y >= this.splotch.height){
            throw(`Attempted to access out of bounds element at (${x}, ${y})`);
        }
        return y * this.splotch.width + x;
    }
    private drawCell(x: number, y: number){
        const value = this.getCell(x, y);
        this.splotch.rect(x, y, 1, 1, 'black');
        this.splotch.rect(x + 0.2, y + 0.2, 0.6, 0.6, value ? 'white' : 'black');
    }
    drawBoard(){
        this.splotch.clear();
        for(let x = 0; x < this.splotch.width; x++){
            for(let y = 0; y < this.splotch.height; y++){
                this.drawCell(x, y);
                // const value = this.getCell(x, y);
                // this.splotch.rect(x + 0.2, y + 0.2, 0.6, 0.6, value ? 'white' : 'black');
            }
        }
    }
    getCell(x: number, y: number): boolean{
        return this.data[this.calcIdx(x, y)];
    }
    setCell(x: number, y: number, value: boolean){
        this.data[this.calcIdx(x, y)] = value;
        this.drawCell(x, y);
    }
    constructor(width: number, height: number){
        this._width = width;
        this._height = height;
        const content = document.getElementById('content');
        this.splotch = new Splotch(content, width, height, 400);
        const clamp = (val: number, min: number, max: number) => {
            if(val < min) return min;
            if(val > max) return max;
            return val;
        }
        const normalizeMouse = (e: SplotchMouseEvent) => {
            e.x = Math.floor(clamp(e.x, 0, width - 1));
            e.y = Math.floor(clamp(e.y, 0, height - 1));
            return e;
        }
        const drawHighlight = (e: SplotchMouseEvent) => {
            this.splotch.rect(e.x, e.y, 1, 0.1, 'yellow');
            this.splotch.rect(e.x, e.y + 0.9, 1, 0.1, 'yellow');
            this.splotch.rect(e.x, e.y, 0.1, 1, 'yellow');
            this.splotch.rect(e.x + 0.9, e.y, 0.1, 1, 'yellow');
        }
        this.splotch.onHover = (e: SplotchMouseEvent) => {
            
            normalizeMouse(e);
            if(e.x !== this.lastMousePos.x || e.y !== this.lastMousePos.y){
                // clear the last cell
                // this.drawCell(this.lastMousePos.x, this.lastMousePos.y);
                this.splotch.rect(this.lastMousePos.x - 1, this.lastMousePos.y - 1, 3, 3, 'black');
                for(let i = -1; i < 2; i++){
                    for(let f = -1; f < 2; f++){
                        const x = this.lastMousePos.x + i;
                        const y = this.lastMousePos.y + f;
                        
                        if(x < 0 || y < 0 || x >= width || y >= height) continue;
                        this.drawCell(x, y);
                    }
                }
                // 'hover' the new cell
                drawHighlight(e);
                this.lastMousePos.x = e.x;
                this.lastMousePos.y = e.y;
            }
        }
        this.splotch.onExit = (e: SplotchMouseEvent) => {
            // clear the last cell
            this.drawCell(this.lastMousePos.x, this.lastMousePos.y);
            // this.drawBoard();
        }
        this.splotch.onClick = (e: SplotchMouseEvent) => {
            // set the current cell
            normalizeMouse(e);
            this.setCell(e.x, e.y, !this.getCell(e.x, e.y));
            this.drawBoard();
            drawHighlight(e);
        }

        this.data = new Array(width * height).fill(false);
        const runButton = document.getElementById('run');
        const stepButton = document.getElementById('step');
        const clearButton = document.getElementById('clear');
        if(!runButton || !stepButton || !clearButton) return;
        runButton.onclick = ()=>this.run();
        stepButton.onclick = ()=>{
            if(this.running) this.run();
            this.step();
        };
        clearButton.onclick = ()=>{
            this.clear();
            if(this.running) this.run();
            this.drawBoard();
        };
    }

    clear(){
        this.data.fill(false);
    }

    // UI stuff
    running = false;
    run(){
        function getStepSpeed(): number{
            const delay = document.getElementById('step-speed') as HTMLInputElement;
            return +delay.value;
        }
        
        const runButton = document.getElementById('run');
        if(!runButton) return;
        this.running = !this.running;
        runButton.innerText = this.running ? 'Stop' : 'Run!';
        if(this.running){
            const spam = async() => {
                while(this.running){
                    const stepSpeed = getStepSpeed();
                    this.step();
                    
                    await new Promise(res => setTimeout(res, stepSpeed < 50 ? 50 : stepSpeed));
                }
            }
            spam();
        }
    }
    step = () => {};
}