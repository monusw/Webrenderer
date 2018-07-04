"use strict";
var Camera = (function () {
    function Camera(fov, aspect, near, far) {
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.projectionMatrix = Matrix4.createPerspective(fov, aspect, near, far);
        this.position = new Vec3();
        this.worldUp = new Vec3(0, 1, 0);
        this.dir = new Vec3(0, 0, -1);
        this.viewMatrix = Matrix4.createLookAt(this.position, this.dir, this.worldUp);
    }
    Camera.prototype.lookAt = function (pos, target, upVec) {
        this.position = pos;
        this.worldUp = upVec.normalize();
        this.dir = target.substract(pos).normalize();
        this.viewMatrix = Matrix4.createLookAt(pos, target, upVec);
    };
    return Camera;
}());
