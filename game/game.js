var map = new RegisterScene(Math.floor((1920*2)/64)*64, Math.floor((1080/64))*64, false);
var grid = new CreateGrid(map.size.x, map.size.y, 64, 64, map.GetId);
let background = map.CreateObject(map.size.x, map.size.y, 0, 0);
map.object.SetImage(background.obj, 'images/sky.png', false);
let bac = document.getElementById(background.obj);
let size = map.size;
let bc1 = map.CreateObject(size.x, 10, 0, 0);
let bc2 = map.CreateObject(10, size.y, size.x, 0);
let bc3 = map.CreateObject(10, size.y, 0, 0);
let x=0;
let poss = [size.y/64-1,size.y/64-2,size.y/64-3, size.y/64-4,size.y/64-5,size.y/64-6, size.y/64-7,size.y/64-8,size.y/64-9]
poss.forEach(y=>{
    for(let i=0;i<size.x/64;i++){
        if(grid.IsPositionOnGridFree(i, y)) {
            let obj = map.CreateObject(64,64,i*64,y*64);
            map.object.SetImage(obj.obj, 'images/grass.png', false);
            grid.AddObject(i,y,map.misc.GetPhysicsObjectFromId(obj.obj));
        };
    };
});
let steve = map.CreateObject(32, 128, 200, 105, false, false, {dynamic:true});
map.object.SetImage(steve.obj, 'images/stevel.png', false);
let doc = document.getElementById(steve.obj);
doc.className = 'SteveBase';
doc.style.backgroundColor='transparent';
let steveHead = map.CreateObject(64, 128, 200, 105);
let steveArms = map.CreateObject(64, 128, 200, 105);
let steveLegs = map.CreateObject(64, 128, 200, 105);
let sh = document.getElementById(steveHead.obj);
let sa = document.getElementById(steveArms.obj);
let sl = document.getElementById(steveLegs.obj);
sh.className = 'SteveHead';
sh.style.backgroundColor = 'transparent';
map.metadata.AddObject(steveHead);
map.metadata.DisablePhysics(steveHead);
map.metadata.AttachElementToElement(steve, steveHead);
sa.className = 'SteveArms';
sa.style.backgroundColor = 'transparent';
map.metadata.AddObject(steveArms);
map.metadata.DisablePhysics(steveArms);
map.metadata.AttachElementToElement(steve, steveArms);
sl.className = 'SteveLegs';
sl.style.backgroundColor = 'transparent';
map.metadata.AddObject(steveLegs);
map.metadata.DisablePhysics(steveLegs);
map.metadata.AttachElementToElement(steve, steveLegs);
map.metadata.FocusOnElement(doc);
var mov = new Movement(doc);
let l=false;
let r=false;
let pobj = map.misc.GetPhysicsObjectFromId(steve.obj);
let ly = pobj.walls[1].y1;
window.addEventListener('keydown', e => {
    if(e.code=='Space'){
        e.preventDefault();
        if(PhysicsObjects[map.render.GetId].gravity>0){
            if(ly!=pobj.walls[1].y1){
                ly=pobj.walls[1].y1;
                setTimeout(()=>{
                    if(ly==pobj.walls[1].y1){
                        PhysicsObjects[map.renderer.GetId].gravity = -13;
                    };
                }, 15);
            } else {
                PhysicsObjects[map.renderer.GetId].gravity = -13;
            };
        };
    } else if(e.code=='KeyA') {
        l=true;
    } else if(e.code=='KeyD'){
        r=true;
    };
});

window.addEventListener('keyup', e => {
    if(e.code=='KeyA')l=false;
    if(e.code=='KeyD')r=false;
});

const Positions = [{min:-45,max:45},{min:-45,max:45}];
let finished = false;

const MoveLegs = () => {
    let rot = Number(getComputedStyle(document.documentElement).getPropertyValue('--slr1').replace('deg', ''));
    if(rot-5>=Positions[0].min&&!finished){
        document.documentElement.style.setProperty('--slr1', rot-5+'deg');
        document.documentElement.style.setProperty('--slr2', -rot+5+'deg');
        if(rot-5<=Positions[0].min){
            finished=true;
        };
    } else {
        document.documentElement.style.setProperty('--slr1', rot+5+'deg');
        document.documentElement.style.setProperty('--slr2', -rot-5+'deg');
        if(rot+5>=Positions[0].max){
            finished=false;
        };
    };
};

const MoveLegsNormal = () => {
    document.documentElement.style.setProperty('--slr1', '0deg');
    document.documentElement.style.setProperty('--slr2', '0deg');
};

function angle(cx, cy, ex, ey) {
    return Math.atan2(ey-cy,ex-cx)*180/Math.PI;
}

let last = 0;
let lasts = 0;

document.addEventListener('mousemove', (e)=>{
    let op = sh.getBoundingClientRect();
    let x = (op.left + sh.clientWidth / 2);
    let y = (op.top + sh.clientHeight / 2);
    let rect = angle(e.clientX, e.clientY, x, y)
    if(last==0){
        if(rect<40&&rect>-20){
            document.documentElement.style.setProperty('--shr1', rect+'deg');
        };
    } else if (last==1) {
        if(rect<-170||(rect<180&&rect>150)){
            document.documentElement.style.setProperty('--shr1', rect+'deg');
        };
    }
});
const func = () =>{
    if(l){
        if(last!=0){
            document.documentElement.style.setProperty('--shr1', '0deg');
            last=0;
        };
        mov.MoveLeft(5);
        document.documentElement.style.setProperty('--sh', 'url("../images/slh.png")');
        document.documentElement.style.setProperty('--sl1', 'url("../images/srll.png")');
        document.documentElement.style.setProperty('--sl2', 'url("../images/slll.png")');
        MoveLegs();
        lasts=0;
    };
    if(r){
        if(last!=1){
            document.documentElement.style.setProperty('--shr1', '179deg');
            last=1;
        };
        mov.MoveRight(5);
        document.documentElement.style.setProperty('--sh', 'url("../images/srh.png")');
        document.documentElement.style.setProperty('--sl1', 'url("../images/srrl.png")');
        document.documentElement.style.setProperty('--sl2', 'url("../images/slrl.png")');
        MoveLegs();
        lasts=0;
    };
    if(!l&&!r&&lasts!=1){
        MoveLegsNormal();
        lasts=1;
    };
    setTimeout(func,10);
};
setTimeout(func,10);

document.addEventListener('click', e=> {
    let rect = bac.getBoundingClientRect();
    let pos = grid.GetCoordsOnGridFromCoords(e.clientX-rect.left,e.clientY-rect.top);
    if(!grid.IsPositionOnGridFree(pos.X,pos.Y)){
        let obj = grid.GetObjectOnGrid(pos.X,pos.Y);
        map.physics.DeletePhysicsObject(obj.obj);
        grid.OverrideObject(pos.X,pos.Y,false);
        document.getElementById(obj.obj).remove();
    };
});

$('body').bind('contextmenu', function(e) {
    let rect = bac.getBoundingClientRect();
    let pos = grid.GetCoordsOnGridFromCoords(e.clientX-rect.left,e.clientY-rect.top);
    let pos2 = grid.GetCoordsOnGridFromCoords(pobj.walls[1].x1, pobj.walls[1].y1);
    if(!(pos.X===pos2.X&&(pos.Y===pos2.Y-1||pos.Y===pos2.Y-2))&&(grid.IsPositionOnGridFree(pos.X,pos.Y)&&grid.IsAdjacentToOtherPosition(pos.X,pos.Y))){
        grid.AddObject(pos.X, pos.Y, map.misc.GetPhysicsObjectFromId(map.CreateObject(64, 64, pos.x, pos.y).obj))
    };
    return false;
});

const PhysicsObject = new Physics('main');
const PhysicsFunc = () => {
    let objs = grid.ActiveObjects;
    objs[pobj.obj]=true;
    objs[bc1.obj]=true;
    objs[bc2.obj]=true;
    objs[bc3.obj]=true;
    for(let i=0;i<PhysicsObjects[map.GetId].length;i++){
        if(!PhysicsObjects[map.GetId][i])continue;
        if(!objs[PhysicsObjects[map.GetId][i].obj]){
            PhysicsObjects[map.GetId][i].mcdisable=true;
        } else {
            PhysicsObjects[map.GetId][i].mcdisable=false;
        };
    };
    PhysicsObject.Next(PhysicsObjects[map.GetId], map.GetId)
    setTimeout(PhysicsFunc,PhysicsObject.GetInterval*10);
};
setTimeout(PhysicsFunc, PhysicsObject.GetInterval*10)

const ChunkFunc = () => {
    grid.SetChunkReferencePoint(pobj.walls[1].x1, pobj.walls[1].y1);
    setTimeout(ChunkFunc, 50);
};
setTimeout(ChunkFunc, 50);

var inventory = new InventoryHandler(map);
inventory.CreatePersonalInventory();
let lastinv = 0;
inventory.FocusOnElement(lastinv);
$(window).bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta >= 0) {
        if(lastinv<8) {
            lastinv++;
        } else {
            lastinv=0;
        };
    } else {
        if(lastinv>0) {
            lastinv--;
        } else {
            lastinv=8;
        };
    };
    inventory.FocusOnElement(lastinv);
});
$(window).bind('keydown', function(event) {
    let num = Number(event.key);
    if(num>0&&num<10) {
        lastinv=num-1;
        inventory.FocusOnElement(lastinv);
    };
});
console.log(document.getElementById('SceneElement'+map.GetId).childNodes.length)