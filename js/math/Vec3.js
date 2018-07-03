"use strict";
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
        return this;
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
        var x = _Math.interp(this.x, v.x, t);
        var y = _Math.interp(this.y, v.y, t);
        var z = _Math.interp(this.z, v.z, t);
        return new Vec3(x, y, z);
    };
    Vec3.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    };
    Vec3.prototype.addScalar = function (s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
    };
    Vec3.prototype.mulScalar = function (s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    };
    Vec3.prototype.normalize = function () {
        var tmp = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        if (tmp === 0) {
            console.warn("WebRender.Vec3: zero vector; normilize failed.");
            return this;
        }
        this.x /= tmp;
        this.y /= tmp;
        this.z /= tmp;
        return this;
    };
    Vec3.prototype.substract = function (vec) {
        var res = new Vec3();
        res.x = this.x - vec.x;
        res.y = this.y - vec.y;
        res.z = this.z - vec.z;
        return res;
    };
    Vec3.prototype.cross = function (vec) {
        var ax = this.x, ay = this.y, az = this.z;
        var bx = vec.x, by = vec.y, bz = vec.z;
        var res = new Vec3();
        res.x = ay * bz - az * by;
        res.y = az * bx - ax * bz;
        res.z = ax * by - ay * bx;
        return res;
    };
    Vec3.prototype.lengthSq = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };
    return Vec3;
}());
