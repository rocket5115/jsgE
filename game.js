var map = new RegisterScene(1920, 1080, false);
/*map.CreateObject(1920,10,0,0,false,false);
map.CreateObject(10,1070,0,0,false,false);
map.CreateObject(10,1070,1920,0,false,false);
map.CreateObject(1920, 40, 0, 1080, false, true);*/
map.CreateBorders(10,10)
map.CreateObject(20, 300, 100, 1000, false, false);
let plank = map.CreateObject(400, 10, 100, 800, false, false);
map.CreateObject(20, 300, 500, 1000, false, false);
let obj = map.CreateObject(200, 40, 200, 605, false, false, {dynamic:true});
let doc = document.getElementById(obj.obj)
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
    if(e.code=='KeyA'){
        l=false;
    };
    if(e.code=='KeyD'){
        r=false;
    };
});

const func = () =>{
    if(l){
        mov.MoveLeft(5);
    };
    if(r){
        mov.MoveRight(5);
    };
    setTimeout(func,10)
}
setTimeout(func,10)

var misc = new Misc();

//console.log(misc.GetDOMObjectFromWalls(obj.walls));
//console.log(misc.GetDOMObjectFromId(obj.obj));
//console.log(misc.GetPhysicsObjectFromWalls(obj.walls));
//console.log(misc.GetPhysicsObjectFromId(obj.id));

map.renderer.physics.metadata.AddObject(doc);
map.renderer.physics.metadata.AddObject(plank);
setTimeout(()=> {
    console.log(map.metadata.EnablePhysics(plank))
},1000);
console.log(map.metadata.DisablePhysics(plank));
//console.log(map.renderer.physics.metadata.DisablePhysics(doc));
//console.log(map.renderer.physics.metadata.EnablePhysics(doc));