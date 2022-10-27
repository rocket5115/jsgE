const PhysicsObjects = [];
const DynamicObjects =[];
const StaticObjects =[];

class RegisterPhysicsObject {
    constructor(id) {
        this.id = id;
        PhysicsObjects[this.id]=[];
        PhysicsObjects[this.id].gravity = 9;
        DynamicObjects[this.id]=[];
        StaticObjects[this.id]=[];
    };
    RegisterPhysicsObject(obj,north,west,south,east,metadata) {
        PhysicsObjects[this.id].push({obj:obj,walls:[north,south,east,west],static:metadata.dynamic,id:this.id})
        if(metadata.dynamic){
            DynamicObjects[this.id].push(PhysicsObjects[this.id].length-1)
        } else {
            StaticObjects[this.id].push(PhysicsObjects[this.id].length-1)
        };
    };
}

const CheckStaticWalls = (swall,id,child) => {
    let is = false;
    for(let i=0;i<StaticObjects[id].length;i++){
        let obj = PhysicsObjects[id][StaticObjects[id][i]];
        let doc = document.getElementById(child);
        let height = Number(doc.style.height.replace('px',''));
        let nwall = obj.walls[0];
        if((swall.y1+PhysicsObjects[id].gravity+height)<nwall.y1) is=true;
        if(is) break;
    };
    return is;
};

const GetDifference = (swall,id,child) => {
    let is = 0;
    for(let i=0;i<StaticObjects[id].length;i++){
        let obj = PhysicsObjects[id][StaticObjects[id][i]];
        let doc = document.getElementById(child);
        let height = Number(doc.style.height.replace('px',''));
        let nwall = obj.walls[0];
        if((swall.y1+PhysicsObjects[id].gravity+height)>nwall.y1) return nwall.y1-(swall.y1+height);
        if(is) break;
    };
    return is;
};

class Physics {
    constructor(id){
        this.id = id;
    };
    Next(data) {
        data.forEach(value => {
            for(let i=0;i<value.length;i++){
                if(typeof(value[i])=='object'){
                    let wall = CheckStaticWalls(value[i].walls[1],value[i].id,value[i].obj);
                    if(wall){
                        let doc=document.getElementById(value[i].obj);
                        doc.style.top=Number(doc.style.top.replace('px',''))+PhysicsObjects[value[i].id].gravity+'px';
                        for(let j=0;j<value[i].walls.length;j++) {
                            value[i].walls[j].y1=value[i].walls[j].y1+PhysicsObjects[value[i].id].gravity
                            value[i].walls[j].y2=value[i].walls[j].y2+PhysicsObjects[value[i].id].gravity
                        };
                    } else if(!wall) {
                        let difference = GetDifference(value[i].walls[1],value[i].id,value[i].obj)
                        let doc=document.getElementById(value[i].obj);
                        doc.style.top=Number(doc.style.top.replace('px',''))+difference+'px';
                        for(let j=0;j<value[i].walls.length;j++) {
                            value[i].walls[j].y1=value[i].walls[j].y1+difference
                            value[i].walls[j].y2=value[i].walls[j].y2+difference
                        };
                    };
                }
            };
        });
    };
};

const physics = new Physics('main');
const PhysicsQueue = [];

setInterval(()=>{
    PhysicsObjects.forEach((value, id)=> {
        for(let i=0;i<value.length;i++){
            if(value[i].static){
                PhysicsQueue.push([value[i], id]);
            };
        }
    });
    physics.Next(PhysicsQueue);
    PhysicsQueue.length=0;
},10);