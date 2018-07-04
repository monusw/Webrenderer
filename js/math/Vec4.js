"use strict";
var Vec4 = (function () {
    function Vec4(_x, _y, _z, _w) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        if (_z === void 0) { _z = 0; }
        if (_w === void 0) { _w = 0; }
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.w = _w;
    }
    Vec4.prototype.set = function (_x, _y, _z, _w) {
        if (_w === void 0) { _w = 1; }
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.w = _w;
        return this;
    };
    Vec4.prototype.setVec3 = function (v, _w) {
        if (_w === void 0) { _w = 1; }
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = _w;
        return this;
    };
    Vec4.prototype.getVec3 = function () {
        return new Vec3(this.x, this.y, this.z);
    };
    Vec4.prototype.clone = function () {
        return new Vec4(this.x, this.y, this.z, this.w);
    };
    Vec4.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
        return this;
    };
    Vec4.prototype.addScalar = function (s) {
        this.x += s;
        this.y += s;
        this.z += s;
        this.w += s;
        return this;
    };
    Vec4.prototype.mulScalar = function (s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    };
    return Vec4;
}());
