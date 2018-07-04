class WebRenderer {

    private ctx: CanvasRenderingContext2D;
    public bufferData: ImageData;
    private width: number;
    private height: number;

    public enableZBuffer: boolean = true;
    private depthBuffer: number[] = [];

    public static MAX_DEPTH: number = 1.0;

    constructor(_canvas: HTMLCanvasElement, width: number, height: number) {
        _canvas.width = width;
        _canvas.height = height;
        this.ctx = _canvas.getContext("2d") as CanvasRenderingContext2D;
        this.bufferData = this.ctx.createImageData(width, height);
        this.width = width;
        this.height = height;
        this.clearBuffer();
    }

    public clearBuffer() {
        var index = 0;
        var data = this.bufferData.data;
        this.depthBuffer = [];
        for (var h = 0; h < this.height; h++) {
            for (var w = 0; w < this.width; w++) {
                index = (h * this.width + w) * 4;
                data[index] = 0;
                data[index+1] = 0;
                data[index+2] = 0;
                data[index+3] = 255;
                this.depthBuffer[h * this.width + w] = WebRenderer.MAX_DEPTH;
            }
        }
        
    }

    public render() {
        this.ctx.putImageData(this.bufferData, 0, 0);
    }

    public renderScene(scene: Scene, camera: Camera) {
        this.clearBuffer();
        for (var obj of scene.children) {
            if (obj.type == "Box") {
                this.drawBox(obj as Box, camera);
            }
        }
        this.render();
    }

    public drawPixel(x: number, y: number, color: Color, alpha = 1.0, depth?: number) {
        if (x > this.width || y > this.height || x < 0 || y < 0) {
            return;
        }
        x = Math.round(x); y = Math.round(y);
        if (this.enableZBuffer) {
            if (depth === undefined) {
                depth = WebRenderer.MAX_DEPTH;
            }

            if (depth > this.depthBuffer[y * this.width + x]) {
                return;
            }
            this.depthBuffer[y * this.width + x] = depth;
        }
        var index = (y * this.width + x) * 4;
        var data = this.bufferData.data;
        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = 255 * alpha;
    }

    public drawLine(_v1: Vertex, _v2: Vertex) {
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
                x1 = x2; x2 = tmp;
                tmp = y1; y1 = y2; y2 = tmp;
                v1.color.swap(v2.color);
            }
            var flag = y2 >= y1 ? 1 : -1;
            var k = flag * (dy << 1);
            var e = -dx * flag;
            for (var x = x1, y = y1; x <= x2; x++) {
                var t = (x-x1) / (x2-x1);
                var color = v1.color.interp(v2.color, t);
                var depth = _Math.interp(v1.depth, v2.depth, t);
                this.drawPixel(x, y, color, 1.0, depth);
                e += k;
                if (flag * e > 0) {
                    y += flag;
                    e -= 2 * dx * flag;
                }
            }
        } else {
            if (y1 > y2) {
                var tmp = x1;
                x1 = x2; x2 = tmp;
                tmp = y1; y1 = y2; y2 = tmp;
                v1.color.swap(v2.color);
            }
            var flag = x2 > x1 ? 1 : -1;
            var k = flag * (dx << 1);
            var e = -dy * flag;
            for (var x = x1, y = y1; y <= y2; y++) {
                var t = (y - y1) / (y2 - y1);
                var color = v1.color.interp(v2.color, t);
                var depth = _Math.interp(v1.depth, v2.depth, t);
                this.drawPixel(x, y, color, 1.0, t);
                e += k;
                if (flag * e > 0) {
                    x += flag;
                    e -= 2 * dy * flag;
                }
            }
        }
    }

    public drawTriangle(_v1: Vertex, _v2: Vertex, _v3: Vertex) {
        var v1 = _v1.clone();
        var v2 = _v2.clone();
        var v3 = _v3.clone();
        sortTriangleVertex(v1, v2, v3);
        if (Math.round(v1.position.y) == Math.round(v2.position.y)) {
            this.drawBottomFlatTriangle(v1, v2, v3);
        } else if (Math.round(v2.position.y) == Math.round(v3.position.y)) {
            this.drawTopFlatTriangle(v1, v2, v3);
        } else {
            var t = (v2.position.y - v1.position.y) / (v3.position.y - v1.position.y);
            var v4 = v1.interp(v3, t);
            if (v4.position.x < v2.position.x) {
                v2.swap(v4);
            }
            this.drawBottomFlatTriangle(v2, v4, v3);
            this.drawTopFlatTriangle(v1, v2, v4);
        }
    }

    public drawBoxWireframe(v_vec: Vertex[]) {
        // top
        this.drawSquareWireframe(v_vec[0], v_vec[1], v_vec[5], v_vec[4]);
        // down
        this.drawSquareWireframe(v_vec[3], v_vec[2], v_vec[6], v_vec[7]);
        // left
        this.drawSquareWireframe(v_vec[1], v_vec[2], v_vec[6], v_vec[5]);
        // right
        this.drawSquareWireframe(v_vec[0], v_vec[3], v_vec[7], v_vec[4]);
        // front
        this.drawSquareWireframe(v_vec[0], v_vec[1], v_vec[2], v_vec[3]);
        // back
        this.drawSquareWireframe(v_vec[4], v_vec[5], v_vec[6], v_vec[7]);
    }



    // private functions

    private drawBox(box: Box, camera: Camera) {
        var v_vec = [];
        var proj = camera.projectionMatrix;
        var view = camera.viewMatrix;
        var model = box.generateModelMatrix();
        var triangleIndex = [
            //top
            1, 0, 4, 4, 5, 1,
            // bottom
            7, 3, 2, 2, 6, 7,
            //left
            6, 2, 1, 1, 5, 6,
            //right
            7, 4, 0, 0, 3, 7,
            //front
            2, 3, 0, 0, 1, 2,
            //back 
            6, 5, 4, 4, 7, 6
        ];
        for (var v of box.vertices) {
            var mat = proj.mulMat4(view).mulMat4(model);
            var vec4 = mat.mulVec3(v.position);
            var vec3 = new Vec3(vec4.x / vec4.w, vec4.y / vec4.w, vec4.z / vec4.w);
            var depth = vec3.z;
            vec3.addScalar(1.0).mulScalar(width / 2);
            vec3.y = height - vec3.y;
            var new_v = new Vertex(vec3.x, vec3.y, vec3.z, v.color.clone());
            new_v.depth = depth;
            v_vec.push(new_v);
        }
        if (box.wireframe) {
            for (var i = 0; i < triangleIndex.length; i += 3) {
                this.drawTriangleWireframe(v_vec[triangleIndex[i]], v_vec[triangleIndex[i + 1]], v_vec[triangleIndex[i + 2]]);
            }
        } else {
            for (var i = 0; i < triangleIndex.length; i+= 3) {
                this.drawTriangle(v_vec[triangleIndex[i]], v_vec[triangleIndex[i + 1]], v_vec[triangleIndex[i + 2]]);
            }
        }
    }

    private drawSquareWireframe(v1: Vertex, v2: Vertex, v3: Vertex, v4: Vertex) {
        this.drawLine(v1, v2);
        this.drawLine(v2, v3);
        this.drawLine(v3, v4);
        this.drawLine(v4, v1);
    }

    private drawTriangleWireframe(v1: Vertex, v2: Vertex, v3: Vertex) {
        this.drawLine(v1, v2);
        this.drawLine(v2, v3);
        this.drawLine(v3, v1);
    }

    private drawBottomFlatTriangle(v1: Vertex, v2: Vertex, v3: Vertex) {
        var startY = v1.position.y;
        var endY = v3.position.y;
        for (var y = startY; y <= endY; y++) {
            var t = (y - startY) / (endY - startY);
            var vl = v1.interp(v3, t);
            var vr = v2.interp(v3, t);
            this.drawScanLine(vl, vr);
        }
    }

    private drawTopFlatTriangle(v1: Vertex, v2: Vertex, v3: Vertex) {
        var startY = v1.position.y;
        var endY = v3.position.y;
        for (var y = startY; y <= endY; y++) {
            var t = (y - startY) / (endY - startY);
            var vl = v1.interp(v2, t);
            var vr = v1.interp(v3, t);
            this.drawScanLine(vl, vr);
        }
    }

    // draw the screen scan line
    private drawScanLine(v1: Vertex, v2: Vertex) {
        var x = Math.round(v1.position.x);
        var y = Math.round(v1.position.y);
        var length = Math.round(v2.position.x) - x;
        for (var i = 0; i <= length; i++) {
            var t = i / length;
            var color = v1.color.interp(v2.color, t);
            var depth = _Math.interp(v1.depth, v2.depth, t);
            this.drawPixel(x + i, y, color, 1.0, depth);
        }
    }

}