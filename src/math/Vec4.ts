//TODO: test
class Vec4 {
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    constructor(_x: number = 0, _y: number = 0, _z: number = 0, _w: number = 0) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.w = _w;
    }

    public set(_x: number, _y: number, _z: number, _w: number = 0) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.w = _w;
    }

    public clone() {
        return new Vec4(this.x, this.y, this.z, this.w);
    }

    public add(v: Vec4) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
    }

    public addScalar(s: number) {
        this.x += s;
        this.y += s;
        this.z += s;
        this.w += s;
    }

}