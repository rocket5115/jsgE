var map = new RegisterScene(1920*2, 1080, false);
map.CreateBorders(10,10)
map.CreateObject(20, 300, 300, 1000, false, false);
map.CreateObject(20, 300, 700, 1000, false, false);
let plank = map.CreateObject(400, 10, 300, 800, false, false);
let obj = map.CreateObject(200, 40, 200, 705, false, false, {dynamic:true});
let doc = document.getElementById(obj.obj)
map.metadata.FocusOnElement(doc);
doc.style.backgroundColor = "blue"
var mov = new Movement(doc);
let l=false;
let r=false;
window.addEventListener('keydown', e => {
    if(e.code=='Space'){
        e.preventDefault();
        PhysicsObjects[map.renderer.GetId].gravity = -10;
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
    if(l)mov.MoveLeft(5);
    if(r)mov.MoveRight(5);
    setTimeout(func,10);
};
setTimeout(func,10);
var misc = new Misc();
map.renderer.physics.metadata.AddObject(plank);
let pobj = misc.GetPhysicsObjectFromId(plank.obj);
let skip = false;
misc.PushPhysicsObjectById(plank.obj, 'collisions', function(e,obj){
    if(pobj.disabled){
        map.metadata.EnablePhysics(plank.obj);
    } else {
        if(!skip){
            skip=true;
        }else {
            map.metadata.DisablePhysics(plank.obj);
            skip=false
        }
    }
});
misc.PushPhysicsObjectById(obj.obj, 'collisions', function(e,obj){
    
});