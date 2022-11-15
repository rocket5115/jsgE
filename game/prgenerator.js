class WorldGenerator {
    constructor(scene,grid) {
        this.sobj = scene;
        this.grid = grid;
        this.x = scene.size.x;
        this.y = scene.size.y;
    };
    CreateBottomLayer(metadata) {
        metadata=metadata||{};
        let num = metadata.layers||3;
        let material = metadata.material||'images/bedrock.png';
        let yrepeat = Math.floor(this.y/64)-1;
        let y=[];
        for(let i=0;i<num;i++){
            y[i]=yrepeat;yrepeat--;
        };
        let x=Math.floor(this.x/64);
        console.log(x)
        y.forEach(y=>{
            for(let i=0;i<x;i++){
                let obj = this.sobj.CreateObject(64,64,i*64,y*64);
                this.sobj.object.SetImage(obj.obj, material, false);
                this.grid.AddObject(i,y,this.sobj.misc.GetPhysicsObjectFromId(obj.obj));
            };
        });
        return true;
    };
};