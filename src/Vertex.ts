class Vertex {

    public position: Vec3;
    public color: Color;

    constructor(x: number = 0, y: number = 0, z: number = 0, color?: Color) {
        this.position = new Vec3(x, y, z);
        if (color === undefined) {
            this.color = new Color(0xffffff);
        } else {
            this.color = color;
        }
    }

    public interp(v: Vertex, t: number) {
        var position = this.position.interp(v.position, t);
        var color = this.color.interp(v.color, t);
        return new Vertex(position.x, position.y, position.z, color);
    }

    public swap(v: Vertex) {
        this.position.swap(v.position);
        this.color.swap(v.color);
    }

    public clone(): Vertex {
        var v = new Vertex(this.position.x, this.position.y, this.position.z, this.color.clone());
        return v;
    }
}

// y     v3    v2  v3
// 0x  v1  v2    v1
function sortTriangleVertex(v1: Vertex, v2: Vertex, v3: Vertex) {
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