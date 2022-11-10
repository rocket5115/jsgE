class CreateGrid {
    constructor(Gx, Gy, x, y){
        this.Gx = Gx;
        this.Gy = Gy;
        this.x = x;
        this.y = y;
    };
    ClickedOnGrid(x,y) {
        x=Math.floor(x/this.x)*this.x;
        y=Math.floor(y/this.y)*this.y;
        return {x:x,y:y};
    };
};