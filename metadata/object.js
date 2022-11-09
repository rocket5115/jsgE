class ObjectProperties {
    constructor(id) {
        this.misc = new Misc(id);
    };
    SetImage(id, path, stretch) {
        let doc = this.misc.GetDOMObjectFromId(id);
        doc.style.backgroundImage = `url("${path}")`;
        if(stretch===false)return true;
        doc.style.backgroundSize = `${doc.style.width} ${doc.style.height}`;
        return true;
    };
};
