const RenderObjects = [];

class Renderer {
    constructor(id,x,y,object) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.container = document.getElementById('SceneElement'+id);
        this.parentX = Number(this.container.style.width.replace('px', ''));
        this.parentY = Number(this.container.style.height.replace('px', ''));
        this.lphysics = new RegisterPhysicsObject(id);
        this.lenemies = new EnemiesCreator(this.id,object);
        RenderObjects[id]=[];
        this.CenterElement = (num, ext) => {
            return (num-(ext/2));
        };
        this.CreateHTMLElement = (type, width, height, x, y, centerx, centery) => {
            if(centerx) x=x+this.CenterElement(x,width);
            if(centery) y=x+this.CenterElement(y,height);
            if(x+width>this.parentX){
                if(width<x){
                    x=(x+width)-((x+width)-this.parentX)*2
                } else {
                    x=(width-this.parentX)
                };
            }
            if(y+height>this.parentY){
                y=(y-((y+height)-this.parentY))
            }
            if(y<0) y=0;
            if(x<0) x=0;
            let objid = (Math.random()*20).toFixed(10)
            $('#SceneElement'+this.id).append(`<${type} id="SceneElementObject${objid}" style="background-color:red;position:absolute;width:${width}px;height:${height}px;left:${x}px;top:${y}px"></${type}>`);
            return {width: width, height: height, x:x, y:y, id:"SceneElementObject"+objid}
        };
    };
    CreateObject(id, width, height, x, y, centerx, centery) {
        let obj = this.CreateHTMLElement('div', width, height, x, y, centerx, centery);
        RenderObjects[this.id][id]={id:id,width:obj.width,height:obj.height,x:obj.x,y:obj.y, obj:obj.id};
        return RenderObjects[this.id][id];
    };
    GetObject(id) {
        return RenderObjects[this.id][id];
    };
    get physics() {
        return this.lphysics
    };
    get metadata() {
        return this.lphysics.metadata;
    };
    get misc() {
        return this.lphysics.metadata.misc
    };
    get GetId() {
        return this.id
    };
    get enemies() {
        return this.lenemies;
    };
};

class RegisterScene {
    constructor(x,y,n) {
        this.x = x;
        this.y = y;
        this.loverlap = n||false;
        this.id = Math.floor((x/y)*Math.random()*10);
        $("#ScenesContainer").append(`<container id="SceneElement${this.id}" class="Scene" style="position:absolute;width:${x}px;height:${y}px;max-width:${x}px;max-height:${y}px"></container>`);
        this.render = new Renderer(this.id,x,y,this);
        this.deconstruct = new Deconstruct(this.id);
    };
    DeleteScene() {
        this.deconstruct.DeleteAll();
        console.log(`Deleted Scene with ID ${this.id}`);
        delete(this.CreateObject);
        delete(this.CreateBorders);
        delete(this.DeleteScene);
        delete(this.x);
        delete(this.y);
        delete(this.loverlap);
        delete(this.id);
        delete(this.render);
        delete(this.deconstruct);
    };
    get deconstructor() {
        return this.deconstruct;
    };
    get size() {
        return {x:this.x,y:this.y};
    };
    get overlap() {
        return (this.loverlap===true);
    };
    get misc() {
        return this.render.physics.metadata.misc
    };
    get metadata() {
        return this.render.physics.metadata;
    };
    get physics() {
        return this.render.physics;
    };
    get renderer() {
        return this.render;
    };
    get enemies() {
        return this.render.enemies;
    };
    CreateObject(width, height, x, y, centerx, centery, metadata) {
        let obj = this.render.CreateObject("obj", width, height, x, y, centerx, centery);
        this.render.physics.RegisterPhysicsObject(obj.obj,
            {x1:obj.x,y1:obj.y,x2:obj.x+obj.width,y2:obj.y}, 
            {x1:obj.x+obj.width,y1:obj.y,x2:obj.x+obj.width,y2:obj.y+obj.height},
            {x1:obj.x,y1:obj.y+obj.height,x2:obj.x+obj.width,y2:obj.y+obj.height},
            {x1:obj.x,y1:obj.y,x2:obj.x,y2:obj.y+obj.height}, 
            (metadata||{dynamic:false})
        )
        return obj;
    };
    CreateTriggerZone(width, height, x, y, centerx, centery, metadata, def) {
        let obj = this.CreateObject(width, height, x, y, centerx, centery, metadata);
        this.render.physics.metadata.AddObject(obj);
        this.render.physics.metadata.DisablePhysics(obj.obj);
        this.render.physics.metadata.misc.PushPhysicsObjectById(obj.obj, 'collisions', def);
        return obj;
    };
    CreateBorders(p1,p2,p3,p4) {
        let objs = [1,1,1,1]
        if(typeof(p1)==='number'){
            p1=p1>0?p1:1;
            objs[0]=p1;objs[1]=p1;objs[2]=p1;objs[3]=p1;
        };
        if(typeof(p2)==='number'){
            p2=p2>0?p2:1;
            objs[1]=p2;objs[3]=p2;
        };
        if(typeof(p3)==='number'){
            p3=p3>0?p3:1;
            objs[2]=p3;
        };
        if(typeof(p4)==='number'){
            p4=p4>0?p4:1;
            objs[3]=p4;
        };
        p1 = this.CreateObject(this.x,objs[0],0,0,false,false);
        p2 = this.CreateObject(objs[1],this.y-objs[1],this.x,0,false,false);
        p3 = this.CreateObject(this.x,objs[2],0,this.y,false,false);
        p4 = this.CreateObject(objs[3],this.y,0,0,false,false);
        return {p1,p2,p3,p4};
    };
};
setInterval(() => {
    PhysicsObjects.forEach(value=>{
        if(value==undefined)return;
        if(value.gravity<9)value.gravity++;
    });
}, 20);