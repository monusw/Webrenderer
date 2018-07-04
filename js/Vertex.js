"use strict";
var Vertex = (function () {
    function Vertex(x, y, z, color) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        this.position = new Vec3(x, y, z);
        if (color === undefined) {
            this.color = new Color(0xffffff);
        }
        else {
            this.color = color;
        }
        this.depth = WebRenderer.MAX_DEPTH;
    }
    Vertex.prototype.interp = function (v, t) {
        var position = this.position.interp(v.position, t);
        var color = this.color.interp(v.color, t);
        var depth = _Math.interp(this.depth, v.depth, t);
        var v = new Vertex(position.x, position.y, position.z, color);
        v.depth = depth;
        return v;
    };
    Vertex.prototype.swap = function (v) {
        this.position.swap(v.position);
        this.color.swap(v.color);
        var tmp = this.depth;
        this.depth = v.depth;
        v.depth = tmp;
    };
    Vertex.prototype.clone = function () {
        var v = new Vertex(this.position.x, this.position.y, this.position.z, this.color.clone());
        v.depth = this.depth;
        return v;
    };
    return Vertex;
}());
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
