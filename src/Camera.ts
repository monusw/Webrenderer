class Camera {
    public projectionMatrix: Matrix4;
    public viewMatrix: Matrix4;

    private fov: number;
    private aspect: number;
    private near: number;
    private far: number;

    constructor(fov: number, aspect: number, near: number, far: number) {
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.projectionMatrix = Matrix4.createPerspective(fov, aspect, near, far);
        this.viewMatrix = Matrix4.createUnitMat4();
    }

    public lookAt(pos: Vec3, target: Vec3, upVec: Vec3) {
        this.viewMatrix = Matrix4.createLookAt(pos, target, upVec);
    }

}