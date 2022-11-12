class CreateGrid {
    constructor(Gx, Gy, x, y, render){
        this.Gx = Gx;
        this.Gy = Gy;
        this.x = x;
        this.y = y;
        this.grid = [];
        this.griddata = [];
        this.render = render||1;
        this.chunk = 6;
        this.chunks = {x1:0,x2:0+this.chunk,y1:0,y2:0+this.chunk};
        for(let i=0;i<Math.floor(this.Gy/y);i++){
            this.grid[i]=[];
            this.griddata[i]=[];
        };
        let j=0;
        this.grid.forEach(grid=>{
            for(let i=0;i<Math.floor(this.Gx/x);i++){
                grid[i]=false;
                this.griddata[j][i]={type:'grass',texture:'grass.png',hardness:1};
            };
            j++;
        });
        j=undefined;
    };
    get ActiveObjects() {
        let retval = [];
        let i=0;
        this.grid.forEach(grid=>{
            if(i<this.chunks.y1||i>this.chunks.y2){i++;return;};
            for(let j=this.chunks.x1;j<this.chunks.x2;j++){
                if(grid[j]!=false){retval[grid[j].obj]=true;}
            };
        });
        return retval;
    };
    GetObjectOnGrid(x,y) {
        return this.grid[y][x];
    };
    GetCoordsOnGridFromCoords(x,y) {
        x=Math.floor(x/this.x);
        y=Math.floor(y/this.y);
        return {x:x*this.x,y:y*this.y,X:x,Y:y};
    };
    IsPositionOnGridFree(x,y) {
        return (this.grid[y][x]==false);
    };
    IsAdjacentToOtherPosition(x,y) {
        if(this.grid[y-1]==undefined)return true;
        if(this.grid[y+1]==undefined)return true;
        if(this.grid[y][x+1]!=false||this.grid[y][x-1]!=false)return true;
        if(this.grid[y-1][x]!=false||this.grid[y+1][x]!=false)return true;
        return false;
    };
    AddObject(x,y,obj) {
        if(this.grid[y][x])return false;
        this.grid[y][x]=obj;
        return true;
    };
    OverrideObject(x,y,obj) {
        this.grid[y][x]=obj;
        return true;
    };
    ChangeMetadata(x,y,metadata) {
        if(!(this.grid[y]&&this.grid[y][x]))return false;
        if(typeof(metadata)!='object')return false;
    };
    SetChunkReferencePoint(x,y) {
        let xy = this.GetCoordsOnGridFromCoords(x,y);
        this.chunks.x1=xy.X;
        this.chunks.x2=xy.X+this.chunk;
        this.chunks.y1=xy.Y;
        this.chunks.y2=xy.Y+this.chunk;
    };
};