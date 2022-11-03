class Misc {
    constructor(id) {
        this.id = id!=undefined?id:'';
    };
    GetPhysicsObjectFromId(id) {
        let OBJ = {};
        (this.id!=""&&PhysicsObjects[this.id]||PhysicsObjects).forEach(obj => {
            if(this.id==""){
                for(let i=0;i<obj.length;i++){
                    if(obj[i].id==id||obj[i].obj==id){
                        OBJ = obj[i];
                        return;
                    };
                };
            } else {
                if(obj.id==id||obj.obj==id){
                    OBJ = obj;
                    return;
                };
            };
        });
        return OBJ;
    };
    GetPhysicsObjectFromWalls(walls) {
        let OBJ = {};
        (this.id!=""&&PhysicsObjects[this.id]||PhysicsObjects).forEach(obj => {
            if(this.id==""){
                for(let i=0;i<obj.length;i++){
                    if(obj[i].walls==walls){
                        OBJ = obj[i];
                        return;
                    };
                };
            } else {
                if(obj.walls==walls){
                    OBJ = obj;
                    return;
                };
            };
        });
        return OBJ;
    };
    GetDOMObjectFromId(id) {
        let DOM = document.getElementById(id);
        if(!DOM){
            (this.id!=""&&PhysicsObjects[this.id]||PhysicsObjects).forEach(obj => {
                if(this.id==""){
                    for(let i=0;i<obj.length;i++){
                        if(obj[i].id==id||obj[i].obj==id){
                            DOM = document.getElementById(obj[i].id==id?obj[i].id:obj[i].obj);
                            return;
                        };
                    };
                } else {
                    if(obj.id==id||obj.obj==id){
                        DOM = document.getElementById(obj.id==id?obj.id:obj.obj);
                        return;
                    };
                };
            });
            return DOM!=undefined?DOM:{};
        };
        return DOM;
    };
    GetDOMObjectFromWalls(walls) {
        let OBJ = '';
        (this.id!=""&&PhysicsObjects[this.id]||PhysicsObjects).forEach(obj => {
            if(this.id==""){
                for(let i=0;i<obj.length;i++){
                    if(obj[i].walls==walls){
                        OBJ = obj[i].obj;
                        return;
                    };
                };
            } else {
                if(obj.walls==walls){
                    OBJ = obj.obj;
                    return;
                };
            };
        });
        return document.getElementById(OBJ);
    };
    SetPhysicsObjectValueById(id,key,value) {
        let success = false;
        (this.id!=""&&PhysicsObjects[this.id]||PhysicsObjects).forEach(obj => {
            if(this.id==""){
                for(let i=0;i<obj.length;i++){
                    if(obj[i].id==id||obj[i].obj==id){
                        if(obj[i][key]!=undefined){
                            obj[i][key]=value;
                            success = true;
                            return;
                        };
                        return;
                    };
                };
            } else {
                if(obj.id==id||obj.obj==id){
                    if(obj[key]!=undefined){
                        obj[key]=value;
                        success = true;
                        return;
                    };
                    return;
                };
            };
        });
        return success;
    };
};