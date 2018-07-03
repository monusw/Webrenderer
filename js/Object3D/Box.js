"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Box = (function (_super) {
    __extends(Box, _super);
    function Box(width, height, depth) {
        var _this = _super.call(this, "Box") || this;
        _this.vertices = [];
        _this.width = width;
        _this.height = height;
        _this.depth = depth;
        _this.position = new Vec3(0, 0, 0);
        _this.rotation = new Vec3();
        _this.generateVertices();
        return _this;
    }
    Box.prototype.generateVertices = function () {
        var x = this.width / 2;
        var y = this.height / 2;
        var z = this.depth / 2;
        var v0 = new Vertex(x, y, z);
        var v1 = new Vertex(-x, y, z);
        var v2 = new Vertex(-x, -y, z);
        var v3 = new Vertex(x, -y, z);
        var v4 = new Vertex(x, y, -z);
        var v5 = new Vertex(-x, y, -z);
        var v6 = new Vertex(-x, -y, -z);
        var v7 = new Vertex(x, -y, -z);
        this.vertices = [v0, v1, v2, v3, v4, v5, v6, v7];
    };
    Box.prototype.setVertexColor = function (index, color) {
        if (index < 0 || index >= this.vertices.length) {
            return;
        }
        var v = this.vertices[index];
        v.color = color;
    };
    Box.prototype.setColor = function (color) {
        for (var i = 0; i < this.vertices.length; i++) {
            this.setVertexColor(i, color);
        }
    };
    Box.prototype.setPosition = function (p) {
        this.position = p;
        this.generateModelMatrix();
    };
    Box.prototype.generateModelMatrix = function () {
        var mat = Matrix4.createUnitMat4();
        mat = mat.rotateX(this.rotation.x);
        mat = mat.rotateY(this.rotation.y);
        mat = mat.rotateZ(this.rotation.z);
        mat = mat.translate(this.position);
        this.modelMatrix = mat;
        return this.modelMatrix;
    };
    return Box;
}(Object3D));
