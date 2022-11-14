class InventoryHandler {
    constructor(sobj) {
        this.obj = sobj;
        this.lastsel = 0;
        this.pinv = [];
    };
    CreatePersonalInventory() {
        let obj = this.obj.CreateObject((64*9)+10*17, 64, (window.outerWidth-((64*9)+10*17))/2, window.outerHeight-(96*2));
        this.obj.metadata.AddObject(obj);
        this.obj.metadata.DisablePhysics(obj.obj);
        let doc = document.getElementById(obj.obj);
        doc.className = 'Inventory';
        doc.style.position='fixed';
        doc.style.zIndex='5';
        doc.style.width='auto';
        doc.style.height='auto';
        doc.innerHTML='<div id="InventoryTopPadding"></div><div id="InnerInventory"></div><div id="InventoryBottomPadding"></div>'
        let itp = document.getElementById('InventoryTopPadding');
        let ii = document.getElementById('InnerInventory');
        let ibp = document.getElementById('InventoryBottomPadding');
        ii.innerHTML = '<div id="is0" class="InventorySpace"></div>';
        for(let i=0;i<9;i++){
            itp.innerHTML=itp.innerHTML+`<div id="itp${i}"></div>`;
            ii.innerHTML=ii.innerHTML+`<div id="ii${i}" class="InventoryItem"></div><div id="is${i+1}" class="InventorySpace"></div>`;
            ibp.innerHTML=ibp.innerHTML+`<div id="ibp${i}"></div>`;
            this.pinv[i]={slot:i,item:'none',count:0,type:'none',block:false};
        };
        return obj;
    };
    FocusOnElement(pos) {
        if(!document.getElementById('ii'+pos))return;
        if(this.lastsel!=pos){
            document.getElementById('itp'+this.lastsel).style.backgroundColor = 'rgb(179, 179, 179)';
            document.getElementById('is'+this.lastsel).style.backgroundColor = 'rgb(179, 179, 179)';
            document.getElementById('is'+(this.lastsel+1)).style.backgroundColor = 'rgb(179, 179, 179)';
            document.getElementById('ibp'+this.lastsel).style.backgroundColor = 'rgb(179, 179, 179)';
        };
        this.lastsel=pos;
        document.getElementById('itp'+pos).style.backgroundColor = 'white';
        document.getElementById('is'+pos).style.backgroundColor = 'white';
        document.getElementById('is'+(pos+1)).style.backgroundColor = 'white';
        document.getElementById('ibp'+pos).style.backgroundColor = 'white';
    };
    SetItemOnSlot(pos, metadata) {
        this.pinv[pos].item=metadata.item||this.pinv[pos].item;
        this.pinv[pos].count=metadata.count||this.pinv[pos].count;
        this.pinv[pos].block=!(!metadata.block);
        this.pinv[pos].type=metadata.type||(this.pinv[pos].block&&'block'||'item');
        document.getElementById('ii'+pos).style.backgroundImage=`url("images/${this.pinv[pos].item}.png")`;
        return true;
    };
    RemoveItemFromSlot(pos) {
        this.pinv[pos]={slot:pos,item:'none',count:0,type:'none',block:false};
        document.getElementById('ii'+pos).style.backgroundImage="";
        return true;
    };
    GetItemOnSlot(pos) {
        return this.pinv[pos]; 
    };
    SearchForItem(name) {
        let object = false;
        let i=0;
        this.pinv.forEach(obj=>{
            if(obj.item===name){
                object ={name:obj.item,count:obj.count,slot:i};
                return
            };
            i++;
        });
        return object;
    };
    get FirstFreeSlot() {
        let obj = -1;
        this.pinv.forEach(val=>{
            if(obj!=-1)return;
            if(val.item=='none')obj=val.slot;return;
        });
        return obj;
    };
};