const PhysicsObjects = [];
const DynamicObjects =[];
const StaticObjects =[];
const FocusOn = [];

class RegisterPhysicsObject {
    constructor(id) {
        this.id = id;
        PhysicsObjects[this.id]=[];
        PhysicsObjects[this.id].gravity = 9;
        DynamicObjects[this.id]=[];
        StaticObjects[this.id]=[];
        this.ObjectMetadata = new ObjectMetadata(this.id);
        this.objects = [];
    };
    RegisterPhysicsObject(obj,north,east,south,west,metadata) {
        PhysicsObjects[this.id].push({obj:obj,walls:[north,south,west,east],static:!metadata.dynamic,id:this.id,disabled:false,collisions:[],collided:[]});
        this.objects[obj]=PhysicsObjects[this.id].length-1;
        if(metadata.dynamic){
            DynamicObjects[this.id].push(PhysicsObjects[this.id].length-1)
        } else {
            StaticObjects[this.id].push(PhysicsObjects[this.id].length-1)
        };
    };
    get GetId() {
        return this.id;
    };
    get metadata() {
        return this.ObjectMetadata;
    };
    get misc() {
        return this.metadata.misc
    };
    GetIsStatic(id) {
        id=typeof(id)==='string'?id:id.obj||id.id;
        return PhysicsObjects[this.id][this.objects[id]].static;
    };
    GetIsDynamic(id) {
        id=typeof(id)==='string'?id:id.obj||id.id;
        return !PhysicsObjects[this.id][this.objects[id]].static;
    };
};

class ObjectMetadata {
    constructor(id) {
        this.id = id;
        this.lmisc = new Misc(this.id);
        this.objects = [];
    };
    get misc() {
        return this.lmisc;
    };
    DisablePhysics(id) {
        id=typeof(id)==='string'?id:id.obj||id.id;
        if(!this.objects[id])return;
        return this.lmisc.SetPhysicsObjectValueById(id,'disabled',true);
    };
    EnablePhysics(id) {
        id=typeof(id)==='string'?id:id.obj||id.id;
        if(!this.objects[id])return;
        return this.lmisc.SetPhysicsObjectValueById(id,'disabled',false);
    };
    AddObject(obj) {
        if(typeof(obj)==='string'){
            if(!document.getElementById(obj))return;
        };
        if(obj.style===undefined){
            this.objects[obj.obj]=obj;
            return true;
        };
        obj=this.lmisc.GetPhysicsObjectFromId(obj.id||obj.obj);
        this.objects[obj.obj]=obj;
        return true;
    };
    FocusOnElement(obj) {
        if(typeof(obj)==='string'){
            if(!document.getElementById(obj))return;
        };
        if(obj.style===undefined){
            FocusOn[0]=this.misc.GetDOMElementFromId(obj.id||obj.obj);
            return true;
        };
        FocusOn[0]=obj;
        return true;
    };
    ClearFocus() {
        FocusOn[0]=undefined;
        return true;
    }
};

setInterval(()=>{
    if(FocusOn[0]!=undefined){
        let elementRect=FocusOn[0].getBoundingClientRect();
        window.scrollTo((elementRect.left + window.pageXOffset) - (1920/4), (elementRect.top + window.pageYOffset) - (1080 / 2));
    };
}, 15);

// walls [north - 0, south - 1, west - 2, east - 3] // góra, dół, lewo, prawo

const PhysicsMisc = new Misc();

const PhysicsCheckDirection = (parentWalls,childWalls) => {
    let pdisabled = PhysicsMisc.GetPhysicsObjectFromWalls(parentWalls).disabled;
    let cdisabled = PhysicsMisc.GetPhysicsObjectFromWalls(childWalls).disabled;
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
    return{top:top,down:down,left:left,right:right,between:between,inside:inside,overflow:overflow,topdifference:tdist,downdifference:ddist,leftdifference:ldist,rightdifference:rdist,pdisabled:pdisabled,cdisabled:cdisabled};
};

class Physics {
    constructor(id) {
        this.id = id;
        this.interval = 1.0;
        this.dynamicobjects = [];
        this.staticobjects = [];
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
                if((obj.collisions.length>0&&(distances.downdifference<=0&&distances.down)||(distances.topdifference<=0&&distances.top))&&(!distances.left&&!distances.right)){
                    this.OnDynamicCollisions(obj,statics[i]);
                } else if(obj.collisions.length>0){
                    this.OnDynamicCollisions(null,statics[i]);
                };
                if(statics[i].collisions.length>0&&(((distances.downdifference<=0&&distances.down)||(distances.topdifference<=0&&distances.top))||(distances.overflow||distances.inside))&&!(distances.left||distances.right)){
                    if(statics[i].collisions.length>0){
                        this.OnStaticCollisions(statics[i],obj);
                    };
                } else if(statics[i].collisions.length>0){
                    this.OnStaticCollisions(statics[i],obj,null);
                };
                if(distances.cdisabled)continue;
                if(PhysicsObjects[id].gravity>-1) {
                    if(distances.top&&distances.between){
                        let difference=(distances.topdifference-PhysicsObjects[id].gravity>=0);
                        if(difference){
                            if(!tomove){
                                tomove={disabled:tomove.pdisabled,obj:obj.obj,topdifference:distances.topdifference,i:obj.i,walls:obj.walls.length};
                            };
                            if(tomove.topdifference>distances.topdifference){
                                tomove.topdifference=distances.topdifference;
                            };
                        } else {
                            if(!tomove){
                                tomove={disabled:tomove.pdisabled,obj:obj.obj,topdifference:distances.topdifference,i:obj.i,walls:obj.walls.length};
                            };
                            if(tomove.topdifference>distances.topdifference){
                                tomove.topdifference=distances.topdifference;
                            };
                        };
                    };
                } else {
                    if(distances.down&&distances.between){
                        let difference=(distances.downdifference+PhysicsObjects[id].gravity>=0);
                        if(difference){
                            if(!tomove){
                                tomove={instance:distances.downdifference,disabled:tomove.pdisabled,obj:obj.obj,topdifference:distances.downdifference,i:obj.i,walls:obj.walls.length};
                            };
                            if(tomove.topdifference>distances.topdifference){
                                tomove.topdifference=distances.downdifference;
                                tomove.instance=distances.downdifference;
                            };
                        } else {
                            if(!tomove){
                                tomove={instance:distances.downdifference,disabled:tomove.pdisabled,obj:obj.obj,topdifference:distances.downdifference,i:obj.i,walls:obj.walls.length};
                            };
                            if(tomove.topdifference>distances.topdifference){
                                tomove.topdifference=distances.downdifference;
                                tomove.instance=distances.downdifference;
                            };
                        };
                    };
                };
            };
            if(tomove&&PhysicsObjects[id].gravity>=0){
                if(tomove.topdifference>PhysicsObjects[id].gravity)tomove.topdifference=PhysicsObjects[id].gravity;
                if(tomove.disabled)tomove.topdifference=PhysicsObjects[id].gravity;
                let doc=document.getElementById(tomove.obj);
                doc.style.top=Number(doc.style.top.replace('px',''))+tomove.topdifference+'px';
                for(let j=0;j<tomove.walls;j++) {
                    PhysicsObjects[id][tomove.i].walls[j].y1=PhysicsObjects[id][tomove.i].walls[j].y1+tomove.topdifference;
                    PhysicsObjects[id][tomove.i].walls[j].y2=PhysicsObjects[id][tomove.i].walls[j].y2+tomove.topdifference;
                };
            } else if(tomove&&PhysicsObjects[id].gravity<0){
                if(tomove.topdifference+PhysicsObjects[id].gravity>=0){
                    tomove.topdifference=PhysicsObjects[id].gravity;
                } else {
                    tomove.topdifference=0;
                };
                if(tomove.instance+PhysicsObjects[id].gravity<=0){
                    tomove.topdifference=-1
                };
                if(tomove.instance==0){
                    tomove.topdifference=0;
                };
                if(tomove.disabled)tomove.topdifference=PhysicsObjects[id].gravity;
                let doc=document.getElementById(tomove.obj);
                doc.style.top=Number(doc.style.top.replace('px',''))+tomove.topdifference+'px';
                for(let j=0;j<tomove.walls;j++) {
                    PhysicsObjects[id][tomove.i].walls[j].y1=PhysicsObjects[id][tomove.i].walls[j].y1+tomove.topdifference;
                    PhysicsObjects[id][tomove.i].walls[j].y2=PhysicsObjects[id][tomove.i].walls[j].y2+tomove.topdifference;
                };
            };
        });
    };
    OnDynamicCollisions(parent, child) {
        if(parent===null){
            if(this.dynamicobjects[child.obj]){
                this.dynamicobjects[child.obj]=undefined;
                return;
            };
            return;
        };
        if(!this.dynamicobjects[child.obj]){
            this.dynamicobjects[child.obj]=true;
            for(let i=0;i<parent.collisions.length;i++){
                parent.collisions[i](parent,child);
            };
            return;
        };
    };
    OnStaticCollisions(parent, child, res) {
        if(!this.staticobjects[parent.obj]){
            this.staticobjects[parent.obj]={};
        };
        if(res===null){
            if(this.staticobjects[parent.obj][child.obj]){
                this.staticobjects[parent.obj][child.obj]=undefined;
                return;
            };
            return;
        };
        if(!this.staticobjects[parent.obj][child.obj]){
            this.staticobjects[parent.obj][child.obj]=true;
            for(let i=0;i<parent.collisions.length;i++){
                parent.collisions[i](parent,child);
            };
            return;
        };
    };
};

const PhysicsObject = new Physics('main');
const PhysicsFunc = () => {
    PhysicsObjects.forEach((value,id)=>{
        if(value==undefined)return;
        PhysicsObject.Next(value,id);
    });
    setTimeout(PhysicsFunc,PhysicsObject.GetInterval*10);
};
setTimeout(PhysicsFunc, PhysicsObject.GetInterval*10)

class Movement {
    constructor(element) {
        this.obj = element;
        this.method = 'dynamic';
        this.dynamicobjects = [];
        PhysicsObjects.forEach((value,id)=>{
            for(let i=0;i<value.length;i++){
                if(value[i].obj==element.id){
                    this.id=id;
                    this.i=i;
                    this.static=value[i].static;
                };
            };
        });
        if(this.static){
            this.method='static';
        };
    };
    MoveLeft(dist){
        if(!PhysicsObjects[this.id])return this.DeleteMovement();
        let statics=[];
        PhysicsObjects[this.id].forEach(obj=>{
            if(this.method=='dynamic'){
                if(obj.static){statics.push(obj);return;};
            } else {
                statics[i].push(obj);return;
            };
        });
        let fobj = false;
        let instance = {};
        for(let i=0;i<statics.length;i++){
            let distances = PhysicsCheckDirection(PhysicsObjects[this.id][this.i].walls,statics[i].walls);
            if(PhysicsObjects[this.id][this.i].collisions.length>0&&distances.right&&!distances.between&&!(distances.top||distances.down)&&distances.rightdifference<=0){
                this.OnCollisions(PhysicsObjects[this.id][this.i], statics[i]);
            } else if(PhysicsObjects[this.id][this.i].collisions.length>0){
                this.OnCollisions(null, statics[i]);
            };
            if(distances.right&&!distances.between&&!(distances.top||distances.down)&&!distances.disabled){
                let difference=(distances.rightdifference-dist>=0);
                if(difference){
                    if(!fobj){
                        fobj=distances.rightdifference;
                        instance=distances;
                    };
                    if(fobj>distances.rightdifference){
                        fobj=distances.rightdifference;
                        instance=distances;
                    };
                } else {
                    if(!fobj){
                        fobj=distances.rightdifference-dist;
                        instance=distances;
                    };
                    if(fobj>distances.rightdifference){
                        fobj=distances.rightdifference-dist;
                        instance=distances;
                    };
                };
            };
        };
        if(fobj>dist){
            fobj=dist;
        };
        if(instance.rightdifference<fobj){
            fobj=instance.rightdifference;
        };
        if(fobj<0){
            fobj=0;
        };
        let doc=this.obj;
        doc.style.left=Number(doc.style.left.replace('px',''))-fobj+'px';
        for(let j=0;j<PhysicsObjects[this.id][this.i].walls.length;j++) {
            PhysicsObjects[this.id][this.i].walls[j].x1=PhysicsObjects[this.id][this.i].walls[j].x1-fobj;
            PhysicsObjects[this.id][this.i].walls[j].x2=PhysicsObjects[this.id][this.i].walls[j].x2-fobj;
        };
    };
    MoveRight(dist){
        if(!PhysicsObjects[this.id])return this.DeleteMovement();
        let statics=[];
        PhysicsObjects[this.id].forEach(obj=>{
            if(this.method=='dynamic'){
                if(obj.static){statics.push(obj);return;};
            } else {
                statics[i].push(obj);return;
            };
        });
        let fobj = false;
        let instance = {};
        for(let i=0;i<statics.length;i++){
            let distances = PhysicsCheckDirection(PhysicsObjects[this.id][this.i].walls,statics[i].walls);
            if(PhysicsObjects[this.id][this.i].collisions.length>0&&distances.left&&!distances.between&&!(distances.top||distances.down)&&distances.leftdifference<=0){
                this.OnCollisions(PhysicsObjects[this.id][this.i], statics[i]);
            } else if(PhysicsObjects[this.id][this.i].collisions.length>0){
                this.OnCollisions(null, statics[i]);
            };
            if(distances.left&&!distances.between&&!(distances.top||distances.down)&&!distances.disabled){
                let difference=(distances.leftdifference-dist>=0);
                if(difference){
                    if(!fobj){
                        fobj=distances.leftdifference;
                        instance=distances;
                    };
                    if(fobj>distances.leftdifference){
                        fobj=distances.leftdifference;
                        instance=distances;
                    };
                } else {
                    if(!fobj){
                        fobj=distances.leftdifference-dist;
                        instance=distances;
                    };
                    if(fobj>distances.leftdifference){
                        fobj=distances.leftdifference-dist;
                        instance=distances;
                    };
                };
            };
        };
        if(fobj>dist){
            fobj=dist;
        };
        if(instance.leftdifference<fobj){
            fobj=instance.leftdifference;
        };
        if(fobj<0){
            fobj=0;
        };
        let doc=this.obj;
        doc.style.left=Number(doc.style.left.replace('px',''))+fobj+'px';
        for(let j=0;j<PhysicsObjects[this.id][this.i].walls.length;j++) {
            PhysicsObjects[this.id][this.i].walls[j].x1=PhysicsObjects[this.id][this.i].walls[j].x1+fobj;
            PhysicsObjects[this.id][this.i].walls[j].x2=PhysicsObjects[this.id][this.i].walls[j].x2+fobj;
        };
    };
    DeleteMovement(){
        if(!this.id)return false;
        console.log(`Deleted Movement Object with ID ${this.id}`);
        delete(this.obj);
        delete(this.id);
        delete(this.i);
        delete(this.MoveLeft);
        delete(this.MoveRight);
        delete(this.DeleteMovement);
        return true;
    };
    OnCollisions(parent, child) {
        if(parent===null){
            if(this.dynamicobjects[child.obj]){
                this.dynamicobjects[child.obj]=undefined;
                return;
            };
            return;
        };
        if(!this.dynamicobjects[child.obj]){
            this.dynamicobjects[child.obj]=true;
            for(let i=0;i<parent.collisions.length;i++){
                parent.collisions[i](parent,child);
            };
            return;
        };
    };
};