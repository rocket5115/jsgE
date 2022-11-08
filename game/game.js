var map = new RegisterScene(Math.floor((1920*2)/64)*64, Math.floor((1080/64))*64, false);
let background = map.CreateObject(map.size.x, map.size.y, 0, 0);
map.object.SetImage(background.obj, 'sky.png', false)
let size = map.size;
map.CreateObject(size.x, 10, 0, 0);
map.CreateObject(10, size.y, size.x, 0);
map.CreateObject(10, size.y, 0, 0);
let x=0;
for(let i=0;i<size.x/64;i++){
    map.object.SetImage(map.CreateObject(64,64,x,size.y).obj, 'grass.png', false);
    x=x+64;
};
//let borders = map.CreateBorders(1,1,64,1);
//map.object.SetImage(borders[2].obj, 'grass.png', false);
// map.CreateObject(20, 300, 300, 1000, false, false);
// map.CreateObject(20, 300, 700, 1000, false, false);
// let plank = map.CreateObject(400, 10, 300, 800, false, false);
let obj = map.CreateObject(64, 128, 200, 705, false, false, {dynamic:true});
map.object.SetImage(obj.obj, 'stevel.png', false)
let doc = document.getElementById(obj.obj);
doc.style.backgroundColor='transparent';
map.metadata.FocusOnElement(doc);
var mov = new Movement(doc);
let l=false;
let r=false;
let pobj = map.misc.GetPhysicsObjectFromId(obj.obj);
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

const func = () =>{
    if(l){
        mov.MoveLeft(5);map.object.SetImage(obj.obj, 'stevel.png', false);
    };
    if(r){
        mov.MoveRight(5);map.object.SetImage(obj.obj, 'stever.png', false);
    };
    setTimeout(func,10);
};
setTimeout(func,10);