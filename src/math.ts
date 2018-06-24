function interp(x1: number, x2: number, t: number) {
    return x1 + (x2 - x1) * t;
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

class Vec3 {

    public x: number;
    public y: number;
    public z: number;

    constructor(_x: number = 0, _y: number = 0, _z: number = 0) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }

    public set (_x: number, _y: number, _z: number) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }

    public clone() {
        return new Vec3(this.x, this.y, this.z);
    }

    public swap(v: Vec3) {
        var tmp = v.clone();
        v.x = this.x; 
        v.y = this.y; 
        v.z = this.z;
        this.x = tmp.x; 
        this.y = tmp.y; 
        this.z = tmp.z;
    }

    public interp(v: Vec3, t: number): Vec3 {
        var x = interp(this.x, v.x, t);
        var y = interp(this.y, v.y, t);
        var z = interp(this.z, v.z, t);
        return new Vec3(x, y, z);
    }

    public add(v: Vec3) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    public addScalar(s: number) {
        this.x += s;
        this.y += s;
        this.z += s;
    }
}

