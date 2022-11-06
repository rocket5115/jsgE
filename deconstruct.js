class Deconstruct {
    constructor(id) {
        this.id = id;
    };
    DeletePhysics() {
        PhysicsObjects[this.id]=undefined;
        DynamicObjects[this.id]=undefined;
        StaticObjects[this.id]=undefined;
    };
    DeleteObjects() {
        RenderObjects[this.id]=undefined;
    };
    DeleteElements() {
        let num=document.getElementById(`SceneElement${this.id}`).childNodes
        for(let i=num.length-1;i>-1;i--){
            if(FocusOn[0]==num[i])FocusOn[0]=undefined;
            num[i].remove();
        };
    };
    DeleteScene() {
        document.getElementById(`SceneElement${this.id}`).remove();
    };
    DeleteAll() {
        this.DeletePhysics();
        this.DeleteObjects();
        this.DeleteElements();
        this.DeleteScene();
    };
};