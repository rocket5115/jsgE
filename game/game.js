var map = new RegisterScene(Math.floor((1920*2)/64)*64, Math.floor((1080/64))*64, false);
let background = map.CreateObject(map.size.x, map.size.y, 0, 0);
map.object.SetImage(background.obj, 'images/sky.png', false)
let size = map.size;
map.CreateObject(size.x, 10, 0, 0);
map.CreateObject(10, size.y, size.x, 0);
map.CreateObject(10, size.y, 0, 0);
let x=0;
for(let i=0;i<size.x/64;i++){
    map.object.SetImage(map.CreateObject(64,64,x,size.y).obj, 'images/grass.png', false);
    x=x+64;
};
//let borders = map.CreateBorders(1,1,64,1);
//map.object.SetImage(borders[2].obj, 'grass.png', false);
// map.CreateObject(20, 300, 300, 1000, false, false);
// map.CreateObject(20, 300, 700, 1000, false, false);
// let plank = map.CreateObject(400, 10, 300, 800, false, false);
let steve = map.CreateObject(64, 128, 200, 705, false, false, {dynamic:true});
//map.object.SetImage(steve.obj, 'images/stevel.png', false);
let steveHead = map.CreateObject(64, 128, 200, 705);
let steveArms = map.CreateObject(64, 128, 200, 705);
let steveLegs = map.CreateObject(64, 128, 200, 705);
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
let doc = document.getElementById(steve.obj);
doc.style.backgroundColor='transparent';
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
                        PhysicsObjects[map.renderer.GetId].gravity = -10;
                    };
                }, 15);
            } else {
                PhysicsObjects[map.renderer.GetId].gravity = -10;
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
    let left = Number(getComputedStyle(document.documentElement).getPropertyValue('--sll1').replace('px', ''));
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

document.addEventListener('mousemove', (e)=>{
    let op = sh.getBoundingClientRect();
    let x = (op.left + sh.clientWidth / 2);
    let y = (op.top + sh.clientHeight / 2);
    let rect = angle(e.clientX, e.clientY, x, y)
    if(last==0){
        if(rect<40&&rect>-20){
            document.documentElement.style.setProperty('--shr1', rect+'deg');
        };
    } else {
        if(rect<-170||(rect<180&&rect>150)){
            document.documentElement.style.setProperty('--shr1', rect+'deg');
        };
    }
});
const func = () =>{
    if(l){
        if(last!=0){
            document.documentElement.style.setProperty('--shr1', '0deg');
        };
        mov.MoveLeft(5);
        document.documentElement.style.setProperty('--sh', 'url("../images/slh.png")');
        document.documentElement.style.setProperty('--sl1', 'url("../images/srll.png")');
        document.documentElement.style.setProperty('--sl2', 'url("../images/slll.png")');
        MoveLegs()
        last=0;
    };
    if(r){
        if(last!=1){
            document.documentElement.style.setProperty('--shr1', '179deg');
        };
        mov.MoveRight(5);
        document.documentElement.style.setProperty('--sh', 'url("../images/srh.png")');
        document.documentElement.style.setProperty('--sl1', 'url("../images/srrl.png")');
        document.documentElement.style.setProperty('--sl2', 'url("../images/slrl.png")');
        MoveLegs()
        last=1;
    };
    if(!l&&!r){
        MoveLegsNormal();
    };
    setTimeout(func,10);
};
setTimeout(func,10);

var grid = new CreateGrid(map.size.x, map.size.y, 64, 64);
document.addEventListener('click', function(e) {
    let pos = grid.ClickedOnGrid(e.clientX, e.clientY);
    //map.CreateObject(64, 64, pos.x, pos.y+64)
});