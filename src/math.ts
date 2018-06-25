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

class Matrix4 {
    public elements: number[] = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    // _nij: element at row i and col j
    constructor(_n11: number, _n12: number, _n13:number, _n14:number,
                _n21: number, _n22: number, _n23:number, _n24:number,
                _n31: number, _n32: number, _n33:number, _n34:number,
                _n41: number, _n42: number, _n43:number, _n44:number ) {
        this.elements[0] = _n11, this.elements[1] = _n12, this.elements[2] = _n13, this.elements[3] = _n14;
        this.elements[4] = _n21, this.elements[5] = _n22, this.elements[6] = _n23, this.elements[7] = _n24;
        this.elements[8] = _n31, this.elements[9] = _n32, this.elements[10] = _n33, this.elements[11] = _n34;
        this.elements[12] = _n41, this.elements[13] = _n42, this.elements[14] = _n43, this.elements[15] = _n44;  
    }

    /* perspective (same as glm::perspective)
     * return a projective matrix
     * fov: radians, field of view
     * aspect: width / height
     * nearZ: near z plane, > 0
     * farZ: far z plane, > nearZ > 0
     */
    public static perspective(fov: number, aspect: number, nearZ: number, farZ: number) {
        let cotHalfFoV = 1 / Math.tan(fov/2);
        return new Matrix4(
            cotHalfFoV/aspect, 0,           0,                          0,
            0,                 cotHalfFoV,  0,                          0,
            0,                 0,          -(farZ+nearZ)/(farZ-nearZ), -2*farZ*nearZ/(farZ-nearZ),
            0,                 0,          -1,                          0
        );
    }

    // transpose self
    public transpose() {
        // 1,4
        this.swapPosition(1, 4);
        // 2,8
        this.swapPosition(2, 8);
        // 3,12; 6,9
        this.swapPosition(3, 12);
        this.swapPosition(6, 9);
        // 7,13
        this.swapPosition(7, 13);
        // 11,14
        this.swapPosition(11, 14);
    }

    // return a copy of this object
    public copy() {
        return new Matrix4(
            this.elements[0], this.elements[1], this.elements[2], this.elements[3],
            this.elements[4], this.elements[5], this.elements[6], this.elements[7],
            this.elements[8], this.elements[9], this.elements[10], this.elements[11],
            this.elements[12], this.elements[13], this.elements[14], this.elements[15],
        );
    }

    // return the value at positon(row i, col j)
    // i, j are both from 0 to 3
    public elementAt(i: number, j: number) {
        return this.elements[i * 4 + j];
    }

    // print this object (4x4 matrix) 
    // ONLY for debugging
    public print() {
        console.log(this.elements[0], this.elements[1], this.elements[2], this.elements[3]);
        console.log(this.elements[4], this.elements[5], this.elements[6], this.elements[7]);
        console.log(this.elements[8], this.elements[9], this.elements[10], this.elements[11]);
        console.log(this.elements[12], this.elements[13], this.elements[14], this.elements[15]);
    }

    // swap two position's value of this elements matrix
    private swapPosition(i: number, j: number) {
        var tmp = this.elements[i];
        this.elements[i] = this.elements[j];
        this.elements[j] = tmp;
    }
}

