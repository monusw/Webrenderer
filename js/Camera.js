"use strict";
var Camera = (function () {
    function Camera(fov, aspect, near, far) {
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.projectionMatrix = Matrix4.createPerspective(fov, aspect, near, far);
        this.viewMatrix = Matrix4.createUnitMat4();
    }
    Camera.prototype.lookAt = function (pos, target, upVec) {
        this.viewMatrix = Matrix4.createLookAt(pos, target, upVec);
    };
    return Camera;
}());
