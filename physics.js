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
        this.ObjectMetadata = new ObjectMetadata(this.id);
    };
    RegisterPhysicsObject(obj,north,east,south,west,metadata) {
        PhysicsObjects[this.id].push({obj:obj,walls:[north,south,west,east],static:!metadata.dynamic,id:this.id})
        if(metadata.dynamic){
            DynamicObjects[this.id].push(PhysicsObjects[this.id].length-1)
        } else {
            StaticObjects[this.id].push(PhysicsObjects[this.id].length-1)
        };
    };
    get GetId() {
        return this.id;
    };
    get GetMetadata() {
        return this.ObjectMetadata;
    };
};

class ObjectMetadata {
    constructor(id) {
        this.id = id;
        this.objects = [];
    };
    DisablePhysics(id) {
        id=typeof(id)==='object'?true:false;
        if(!id)return;
        console.log(id)
    };
};

// walls [north - 0, south - 1, west - 2, east - 3] // góra, dół, lewo, prawo

const PhysicsCheckDirection = (parentWalls,childWalls) => {
    let top = (parentWalls[1].y1<=childWalls[0].y1);
    let tdist = 0;
    if(top)tdist=(childWalls[0].y1-parentWalls[1].y1);
    let down = (childWalls[1].y1<=parentWalls[0].y1);
    let ddist = 0;
    if(down)ddist=(parentWalls[0].y1-childWalls[1].y1);
    let left = (parentWalls[3].x1<=childWalls[2].x1);
    let ldist = 0;
    if(left)ldist=(childWalls[2].x1-parentWalls[3].x1);
    let right = (parentWalls[2].x1>=childWalls[3].x1);
    let rdist = 0;
    if(right)rdist=(parentWalls[2].x1-childWalls[3].x1);
    let between = (left&&right)||(parentWalls[3].x1>childWalls[2].x1&&parentWalls[2].x1<childWalls[3].x1);
    let inside = (parentWalls[0].y1>=childWalls[0].y1)&&(parentWalls[1].y1<=childWalls[1].y1);
    let overflow = (parentWalls[1].y1>=childWalls[0].y1&&parentWalls[0].y1<childWalls[0].y1)||(parentWalls[0].y1<childWalls[1].y1&&parentWalls[1].y1>childWalls[1].y1);
    return{top:top,down:down,left:left,right:right,between:between,inside:inside,overflow:overflow,topdifference:tdist,downdifference:ddist,leftdifference:ldist,rightdifference:rdist}
};

class Physics {
    constructor(id) {
        this.id = id;
        this.interval = 1.0;
    };
    get GetInterval() {
        return this.interval;
    };
    SetInterval(interval) {
        if(typeof(interval)=='number'){
            this.interval=interval;
        };
    };
    Next(obj,id) {
        let statics = [];
        let dynamic = [];
        let i=0;
        obj.forEach(obj=>{
            if(obj.static){statics.push(obj);i++;return;};
            obj.i=i;
            if(!obj.static){dynamic.push(obj);i++;return;};
        });
        dynamic.forEach(obj=>{
            let tomove=false;
            for(let i=0;i<statics.length;i++){
                let distances = PhysicsCheckDirection(obj.walls,statics[i].walls);
                if(distances.top&&distances.between){
                    let difference=(distances.topdifference-PhysicsObjects[id].gravity>=0);
                    if(difference){
                        if(!tomove){
                            tomove={obj:obj.obj,topdifference:distances.topdifference,i:obj.i,walls:obj.walls.length};
                        };
                        if(tomove.topdifference>distances.topdifference){
                            tomove.topdifference=distances.topdifference;
                        };
                    } else {
                        if(!tomove){
                            tomove={obj:obj.obj,topdifference:distances.topdifference,i:obj.i,walls:obj.walls.length};
                        };
                        if(tomove.topdifference>distances.topdifference){
                            tomove.topdifference=distances.topdifference;
                        };
                    };
                };
            };
            if(tomove.topdifference>PhysicsObjects[id].gravity){
                tomove.topdifference=PhysicsObjects[id].gravity;
            };
            if(tomove){
                let doc=document.getElementById(tomove.obj);
                doc.style.top=Number(doc.style.top.replace('px',''))+tomove.topdifference+'px';
                for(let j=0;j<tomove.walls;j++) {
                    PhysicsObjects[id][tomove.i].walls[j].y1=PhysicsObjects[id][tomove.i].walls[j].y1+tomove.topdifference;
                    PhysicsObjects[id][tomove.i].walls[j].y2=PhysicsObjects[id][tomove.i].walls[j].y2+tomove.topdifference;
                };
            }
        });
    };
};

const PhysicsObject = new Physics('main');
const PhysicsFunc = () => {
    PhysicsObjects.forEach((value,id)=>{
        PhysicsObject.Next(value,id);
    });
    setTimeout(PhysicsFunc,PhysicsObject.GetInterval*10);
};
setTimeout(PhysicsFunc, PhysicsObject.GetInterval*10)

class Movement {
    constructor(element) {
        this.obj = element;
        PhysicsObjects.forEach((value,id)=>{
            for(let i=0;i<value.length;i++){
                if(value[i].obj==element.id){
                    this.id=id;
                    this.i=i;
                };
            };
        });
    };
    MoveLeft(dist){
        let statics=[];
        PhysicsObjects[this.id].forEach(obj=>{
            if(obj.static){statics.push(obj);return;};
        });
        let fobj = false;
        for(let i=0;i<statics.length;i++){
            let distances = PhysicsCheckDirection(PhysicsObjects[this.id][this.i].walls,statics[i].walls);
            if(distances.right&&!distances.between&&!(distances.top||distances.down)){
                let difference=(distances.rightdifference-dist>=0);
                if(difference){
                    if(!fobj){
                        fobj=distances.rightdifference;
                    };
                    if(fobj>distances.rightdifference){
                        fobj=distances.rightdifference;
                    };
                } else {
                    if(!fobj){
                        fobj=distances.rightdifference;
                    };
                    if(fobj>distances.rightdifference){
                        fobj=distances.rightdifference;
                    };
                };
            };
        };
        if(fobj>dist){
            fobj=dist;
        };
        let doc=this.obj;
        doc.style.left=Number(doc.style.left.replace('px',''))-fobj+'px';
        for(let j=0;j<PhysicsObjects[this.id][this.i].walls.length;j++) {
            PhysicsObjects[this.id][this.i].walls[j].x1=PhysicsObjects[this.id][this.i].walls[j].x1-fobj;
            PhysicsObjects[this.id][this.i].walls[j].x2=PhysicsObjects[this.id][this.i].walls[j].x2-fobj;
        };
    };
    MoveRight(dist){
        let statics=[];
        PhysicsObjects[this.id].forEach(obj=>{
            if(obj.static){statics.push(obj);return;};
        });
        let fobj = false;
        for(let i=0;i<statics.length;i++){
            let distances = PhysicsCheckDirection(PhysicsObjects[this.id][this.i].walls,statics[i].walls);
            if(distances.left&&!distances.between&&!(distances.top||distances.down)){
                let difference=(distances.leftdifference-dist>=0);
                if(difference){
                    if(!fobj){
                        fobj=distances.leftdifference;
                    };
                    if(fobj>distances.leftdifference){
                        fobj=distances.leftdifference;
                    };
                } else {
                    if(!fobj){
                        fobj=distances.leftdifference;
                    };
                    if(fobj>distances.leftdifference){
                        fobj=distances.leftdifference;
                    };
                };
            };
        };
        if(fobj>dist){
            fobj=dist;
        };
        let doc=this.obj;
        doc.style.left=Number(doc.style.left.replace('px',''))+fobj+'px';
        for(let j=0;j<PhysicsObjects[this.id][this.i].walls.length;j++) {
            PhysicsObjects[this.id][this.i].walls[j].x1=PhysicsObjects[this.id][this.i].walls[j].x1+fobj;
            PhysicsObjects[this.id][this.i].walls[j].x2=PhysicsObjects[this.id][this.i].walls[j].x2+fobj;
        };
    };
};