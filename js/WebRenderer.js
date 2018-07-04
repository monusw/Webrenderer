"use strict";
var WebRenderer = (function () {
    function WebRenderer(_canvas, width, height) {
        _canvas.width = width;
        _canvas.height = height;
        this.ctx = _canvas.getContext("2d");
        this.bufferData = this.ctx.createImageData(width, height);
        this.width = width;
        this.height = height;
        this.clearBuffer();
    }
    WebRenderer.prototype.clearBuffer = function () {
        var index = 0;
        var data = this.bufferData.data;
        for (var h = 0; h < this.height; h++) {
            for (var w = 0; w < this.width; w++) {
                index = (h * this.width + w) * 4;
                data[index] = 0;
                data[index + 1] = 0;
                data[index + 2] = 0;
                data[index + 3] = 255;
            }
        }
    };
    WebRenderer.prototype.render = function () {
        this.ctx.putImageData(this.bufferData, 0, 0);
    };
    WebRenderer.prototype.renderScene = function (scene, camera) {
        this.clearBuffer();
        for (var _i = 0, _a = scene.children; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (obj.type == "Box") {
                this.drawBox(obj, camera);
            }
        }
        this.render();
    };
    WebRenderer.prototype.drawPixel = function (x, y, color, alpha) {
        if (alpha === void 0) { alpha = 1.0; }
        if (x > this.width || y > this.height || x < 0 || y < 0) {
            return;
        }
        x = Math.round(x);
        y = Math.round(y);
        var index = (y * this.width + x) * 4;
        var data = this.bufferData.data;
        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = 255 * alpha;
    };
    WebRenderer.prototype.drawLine = function (_v1, _v2) {
        var v1 = _v1.clone();
        var v2 = _v2.clone();
        var x1 = v1.position.x;
        var y1 = v1.position.y;
        var x2 = v2.position.x;
        var y2 = v2.position.y;
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        if (dx >= dy) {
            if (x1 > x2) {
                var tmp = x1;
                x1 = x2;
                x2 = tmp;
                tmp = y1;
                y1 = y2;
                y2 = tmp;
                v1.color.swap(v2.color);
            }
            var flag = y2 >= y1 ? 1 : -1;
            var k = flag * (dy << 1);
            var e = -dx * flag;
            for (var x = x1, y = y1; x <= x2; x++) {
                var t = (x - x1) / (x2 - x1);
                var color = v1.color.interp(v2.color, t);
                this.drawPixel(x, y, color);
                e += k;
                if (flag * e > 0) {
                    y += flag;
                    e -= 2 * dx * flag;
                }
            }
        }
        else {
            if (y1 > y2) {
                var tmp = x1;
                x1 = x2;
                x2 = tmp;
                tmp = y1;
                y1 = y2;
                y2 = tmp;
                v1.color.swap(v2.color);
            }
            var flag = x2 > x1 ? 1 : -1;
            var k = flag * (dx << 1);
            var e = -dy * flag;
            for (var x = x1, y = y1; y <= y2; y++) {
                var t = (y - y1) / (y2 - y1);
                var color = v1.color.interp(v2.color, t);
                this.drawPixel(x, y, color);
                e += k;
                if (flag * e > 0) {
                    x += flag;
                    e -= 2 * dy * flag;
                }
            }
        }
    };
    WebRenderer.prototype.drawTriangle = function (_v1, _v2, _v3) {
        var v1 = _v1.clone();
        var v2 = _v2.clone();
        var v3 = _v3.clone();
        sortTriangleVertex(v1, v2, v3);
        if (Math.round(v1.position.y) == Math.round(v2.position.y)) {
            this.drawBottomFlatTriangle(v1, v2, v3);
        }
        else if (Math.round(v2.position.y) == Math.round(v3.position.y)) {
            this.drawTopFlatTriangle(v1, v2, v3);
        }
        else {
            var t = (v2.position.y - v1.position.y) / (v3.position.y - v1.position.y);
            var v4 = v1.interp(v3, t);
            if (v4.position.x < v2.position.x) {
                v2.swap(v4);
            }
            this.drawBottomFlatTriangle(v2, v4, v3);
            this.drawTopFlatTriangle(v1, v2, v4);
        }
    };
    WebRenderer.prototype.drawBoxWireframe = function (v_vec) {
        this.drawSquareWireframe(v_vec[0], v_vec[1], v_vec[5], v_vec[4]);
        this.drawSquareWireframe(v_vec[3], v_vec[2], v_vec[6], v_vec[7]);
        this.drawSquareWireframe(v_vec[1], v_vec[2], v_vec[6], v_vec[5]);
        this.drawSquareWireframe(v_vec[0], v_vec[3], v_vec[7], v_vec[4]);
        this.drawSquareWireframe(v_vec[0], v_vec[1], v_vec[2], v_vec[3]);
        this.drawSquareWireframe(v_vec[4], v_vec[5], v_vec[6], v_vec[7]);
    };
    WebRenderer.prototype.drawBox = function (box, camera) {
        var v_vec = [];
        var proj = camera.projectionMatrix;
        var view = camera.viewMatrix;
        var model = box.generateModelMatrix();
        var triangleIndex = [
            1, 0, 4, 4, 5, 1,
            7, 3, 2, 2, 6, 7,
            6, 2, 1, 1, 5, 6,
            7, 4, 0, 0, 3, 7,
            2, 3, 0, 0, 1, 2,
            6, 5, 4, 4, 7, 6
        ];
        for (var i = 0; i < triangleIndex.length; i += 3) {
            var v1_vec3 = model.mulVec3(box.vertices[triangleIndex[i]].position).getVec3();
            var v2_vec3 = model.mulVec3(box.vertices[triangleIndex[i + 1]].position).getVec3();
            var v3_vec3 = model.mulVec3(box.vertices[triangleIndex[i + 2]].position).getVec3();
            var isBack = this.backTest(v1_vec3, v2_vec3, v3_vec3, camera.position);
            if (isBack) {
                triangleIndex[i] = -1;
                triangleIndex[i + 1] = -1;
                triangleIndex[i + 2] = -1;
            }
        }
        for (var _i = 0, _a = box.vertices; _i < _a.length; _i++) {
            var v = _a[_i];
            var mat = proj.mulMat4(view).mulMat4(model);
            var vec4 = mat.mulVec3(v.position);
            var vec3 = new Vec3(vec4.x / vec4.w, vec4.y / vec4.w, vec4.z / vec4.w);
            vec3.addScalar(1.0).mulScalar(width / 2);
            vec3.y = height - vec3.y;
            var new_v = new Vertex(vec3.x, vec3.y, vec3.z, v.color.clone());
            v_vec.push(new_v);
        }
        if (box.wireframe) {
            for (var i = 0; i < triangleIndex.length; i += 3) {
                if (triangleIndex[i] == -1) {
                    continue;
                }
                this.drawTriangleWireframe(v_vec[triangleIndex[i]], v_vec[triangleIndex[i + 1]], v_vec[triangleIndex[i + 2]]);
            }
        }
        else {
            for (var i = 0; i < triangleIndex.length; i += 3) {
                if (triangleIndex[i] == -1) {
                    continue;
                }
                this.drawTriangle(v_vec[triangleIndex[i]], v_vec[triangleIndex[i + 1]], v_vec[triangleIndex[i + 2]]);
            }
        }
    };
    WebRenderer.prototype.backTest = function (v1, v2, v3, pos) {
        var v12 = v2.substract(v1);
        var v13 = v3.substract(v1);
        var n = v12.cross(v13);
        var v = v1.substract(pos);
        if (n.dotVec3(v) <= 0) {
            return false;
        }
        else {
            return true;
        }
    };
    WebRenderer.prototype.drawSquareWireframe = function (v1, v2, v3, v4) {
        this.drawLine(v1, v2);
        this.drawLine(v2, v3);
        this.drawLine(v3, v4);
        this.drawLine(v4, v1);
    };
    WebRenderer.prototype.drawTriangleWireframe = function (v1, v2, v3) {
        this.drawLine(v1, v2);
        this.drawLine(v2, v3);
        this.drawLine(v3, v1);
    };
    WebRenderer.prototype.drawBottomFlatTriangle = function (v1, v2, v3) {
        var startY = v1.position.y;
        var endY = v3.position.y;
        for (var y = startY; y <= endY; y++) {
            var t = (y - startY) / (endY - startY);
            var vl = v1.interp(v3, t);
            var vr = v2.interp(v3, t);
            this.drawScanLine(vl, vr);
        }
    };
    WebRenderer.prototype.drawTopFlatTriangle = function (v1, v2, v3) {
        var startY = v1.position.y;
        var endY = v3.position.y;
        for (var y = startY; y <= endY; y++) {
            var t = (y - startY) / (endY - startY);
            var vl = v1.interp(v2, t);
            var vr = v1.interp(v3, t);
            this.drawScanLine(vl, vr);
        }
    };
    WebRenderer.prototype.drawScanLine = function (v1, v2) {
        var x = Math.round(v1.position.x);
        var y = Math.round(v1.position.y);
        var length = Math.round(v2.position.x) - x;
        for (var i = 0; i <= length; i++) {
            var t = i / length;
            var color = v1.color.interp(v2.color, t);
            this.drawPixel(x + i, y, color);
        }
    };
    return WebRenderer;
}());
