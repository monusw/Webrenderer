class WebRenderer {

    private ctx: CanvasRenderingContext2D;
    public bufferData: ImageData;
    private width: number;
    private height: number;

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
        for (var h = 0; h < this.height; h++) {
            for (var w = 0; w < this.width; w++) {
                index = (h * this.width + w) * 4;
                data[index] = 0;
                data[index+1] = 0;
                data[index+2] = 0;
                data[index+3] = 255;
            }
        }
    }

    public render() {
        this.ctx.putImageData(this.bufferData, 0, 0);
    }

    public drawPixel(x: number, y: number, color: Color, alpha = 1.0) {
        if (x > this.width || y > this.height || x < 0 || y < 0) {
            return;
        }
        x = Math.round(x); y = Math.round(y);
        var index = (y * this.width + x) * 4;
        var data = this.bufferData.data;
        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = 255 * alpha;
    }

    public drawLine(v1: Vertex, v2: Vertex) {
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
                this.drawPixel(x, y, color);
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
                this.drawPixel(x, y, color);
                e += k;
                if (flag * e > 0) {
                    x += flag;
                    e -= 2 * dy * flag;
                }
            }
        }
    }

    public drawTriangle(v1: Vertex, v2: Vertex, v3: Vertex) {
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


    // private functions

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
            this.drawPixel(x + i, y, color);
        }
    }

}