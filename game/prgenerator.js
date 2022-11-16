const RandomNumberCheck = (num1,num2) => {
    if(num1==100)return true;
    if(num1==0)return false;
    if(num2<num1)return false;
    return true;
};

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
        let filler = metadata.filler||'images/stone.png';
        let chance = metadata.chance||[];
        let yrepeat = Math.floor(this.y/64)-1;
        let y=[];
        let ychance=[];
        for(let i=0;i<num;i++){
            y[i]=yrepeat;yrepeat--;
            if(chance.length==0){
                ychance[i]=100;
            } else {
                ychance[i]=chance[i]||chance[chance.length-1];
            };
        };
        let x=Math.floor(this.x/64);
        y.forEach((y,k)=>{
            for(let i=0;i<x;i++){
                let rand = Math.random()*100;
                let obj = this.sobj.CreateObject(64,64,i*64,y*64);
                if(RandomNumberCheck(ychance[k],rand)){
                    this.sobj.object.SetImage(obj.obj, material, false);
                } else {
                    this.sobj.object.SetImage(obj.obj, filler, false);
                };
                this.grid.AddObject(i,y,this.sobj.misc.GetPhysicsObjectFromId(obj.obj));
            };
        });
        return true;
    };
};