class ObjectProperties {
    constructor(id) {
        this.misc = new Misc(id);
    };
    SetImage(id, path, scale) {
        let doc = this.misc.GetDOMObjectFromId(id);
        doc.style.backgroundImage = `url("${path}")`;
        if(scale===false)return true;
        doc.style.backgroundSize = `${doc.style.width} ${doc.style.height}`;
        return true;
    };
    GetImageName(id) {
        let doc = this.misc.GetDOMObjectFromId(id);
        let ret = doc.style.backgroundImage;
        return ret.replace('.png")', '').replace('url("images/', '');
    };
};