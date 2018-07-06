class Object3D {

    public type: string;
    public wireframe: boolean;
    public uuid: string;

    public modelMatrix: Matrix4;

    public material?: Material;

    constructor(_type: string = "Object3D") {
        this.type = _type;
        this.wireframe = false;
        this.uuid = _Math.generateUUID();
        this.modelMatrix = Matrix4.createUnitMat4();
    }
}
