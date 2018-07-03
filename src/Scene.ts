class Scene {

    public children: Object3D[];

    constructor() {
        this.children = [];
    }

    public addChild(object: Object3D) {
        this.children.push(object);
    }

    public removeChild(object: Object3D) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].uuid == object.uuid) {
                this.children.splice(i, 1);
                break;
            }
        }
    }
}