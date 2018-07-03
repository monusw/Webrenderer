"use strict";
var Object3D = (function () {
    function Object3D(_type) {
        if (_type === void 0) { _type = "Object3D"; }
        this.type = _type;
        this.wireframe = false;
        this.uuid = _Math.generateUUID();
        this.modelMatrix = Matrix4.createUnitMat4();
    }
    return Object3D;
}());
