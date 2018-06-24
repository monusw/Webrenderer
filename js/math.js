"use strict";
function interp(x1, x2, t) {
    return x1 + (x2 - x1) * t;
}
function sortTriangleVertex(v1, v2, v3) {
    if (v1.position.y > v2.position.y || (v1.position.y == v2.position.y && v1.position.x > v2.position.x)) {
        v1.swap(v2);
    }
    if (v2.position.y > v3.position.y || (v2.position.y == v3.position.y && v2.position.x > v3.position.x)) {
        v2.swap(v3);
    }
    if (v1.position.y > v2.position.y || (v1.position.y == v2.position.y && v1.position.x > v2.position.x)) {
        v1.swap(v2);
    }
}
var Vec3 = (function () {
    function Vec3(_x, _y, _z) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        if (_z === void 0) { _z = 0; }
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }
    Vec3.prototype.set = function (_x, _y, _z) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
    };
    Vec3.prototype.clone = function () {
        return new Vec3(this.x, this.y, this.z);
    };
    Vec3.prototype.swap = function (v) {
        var tmp = v.clone();
        v.x = this.x;
        v.y = this.y;
        v.z = this.z;
        this.x = tmp.x;
        this.y = tmp.y;
        this.z = tmp.z;
    };
    Vec3.prototype.interp = function (v, t) {
        var x = interp(this.x, v.x, t);
        var y = interp(this.y, v.y, t);
        var z = interp(this.z, v.z, t);
        return new Vec3(x, y, z);
    };
    Vec3.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    };
    Vec3.prototype.addScalar = function (s) {
        this.x += s;
        this.y += s;
        this.z += s;
    };
    return Vec3;
}());
