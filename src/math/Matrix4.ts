// TODO: test
class Matrix4 {
    // NOTE: member function with keyword `const function` will not modify this.elements in function body.

    public elements: number[] = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    // _nij: element at row i and col j
    constructor(_n11: number = 1, _n12: number = 0, _n13: number = 0, _n14: number = 0,
        _n21: number = 0, _n22: number = 1, _n23: number = 0, _n24: number = 0,
        _n31: number = 0, _n32: number = 0, _n33: number = 1, _n34: number = 0,
        _n41: number = 0, _n42: number = 0, _n43: number = 0, _n44: number = 1) {
        this.elements[0] = _n11, this.elements[1] = _n12, this.elements[2] = _n13, this.elements[3] = _n14;
        this.elements[4] = _n21, this.elements[5] = _n22, this.elements[6] = _n23, this.elements[7] = _n24;
        this.elements[8] = _n31, this.elements[9] = _n32, this.elements[10] = _n33, this.elements[11] = _n34;
        this.elements[12] = _n41, this.elements[13] = _n42, this.elements[14] = _n43, this.elements[15] = _n44;
    }

    public set(_n11: number = 1, _n12: number = 0, _n13: number = 0, _n14: number = 0,
        _n21: number = 0, _n22: number = 1, _n23: number = 0, _n24: number = 0,
        _n31: number = 0, _n32: number = 0, _n33: number = 1, _n34: number = 0,
        _n41: number = 0, _n42: number = 0, _n43: number = 0, _n44: number = 1) {
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
    public static createPerspective(fov: number, aspect: number, nearZ: number, farZ: number): Matrix4 {
        let cotHalfFoV = 1 / Math.tan(fov / 2);
        return new Matrix4(
            cotHalfFoV / aspect, 0,          0,                                0,
            0,                   cotHalfFoV, 0,                                0,
            0,                   0,         -(farZ + nearZ) / (farZ - nearZ), -2 * farZ * nearZ / (farZ - nearZ),
            0,                   0,         -1,                                0
        );
    }

    // return an unit matirx
    public static createUnitMat4(): Matrix4 {
        return new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    // return a translateion matrix
    // M .* p => let p move dir 
    public static createTranslate(dir: Vec3, mat4?: Matrix4): Matrix4 {
        if (mat4 == undefined) {
            mat4 = Matrix4.createUnitMat4();
        }

        let tmat4 = new Matrix4(
            1, 0, 0, dir.x,
            0, 1, 0, dir.y,
            0, 0, 1, dir.z,
            0, 0, 0, 1
        );
        return tmat4.mulMat4(mat4);
    }

    // return a rotation matrix with tha axis x, y, or z
    // all the input angles are radians
    public static createRotateX(angle: number, mat4?: Matrix4): Matrix4 {
        if (mat4 == undefined) {
            mat4 = Matrix4.createUnitMat4();
        }

        let c = Math.cos(angle);
        let s = Math.sin(angle);

        let rmat =  new Matrix4(
            1, 0,  0, 0,
            0, c, -s, 0,
            0, s,  c, 0,
            0, 0,  0, 1
        );

        return rmat.mulMat4(mat4);
    }

    public static createRotateY(angle: number, mat4?: Matrix4): Matrix4 {
        if (mat4 == undefined) {
            mat4 = Matrix4.createUnitMat4();
        }

        let c = Math.cos(angle);
        let s = Math.sin(angle);

        let rmat =  new Matrix4(
             c, 0, s, 0,
             0, 1, 0, 0,
            -s, 0, c, 0,
             0, 0, 0, 1
        );

        return rmat.mulMat4(mat4);
    }

    public static createRotateZ(angle: number, mat4?: Matrix4): Matrix4 {
        if (mat4 == undefined) {
            mat4 = Matrix4.createUnitMat4();
        }

        let c = Math.cos(angle);
        let s = Math.sin(angle);

        let rmat =  new Matrix4(
            c, -s, 0, 0,
            s,  c, 0, 0,
            0,  0, 1, 0,
            0,  0, 0, 1
        );

        return rmat.mulMat4(mat4);
    }

    // return translation matrix .* self
    // const function
    public translate(dir: Vec3): Matrix4 {
        return Matrix4.createTranslate(dir,this);
    }

    // return rotation matix .* self
    // const function
    public rotateX(angle: number): Matrix4 {
        return Matrix4.createRotateX(angle,this);
    }

    public rotateY(angle: number): Matrix4 {
        return Matrix4.createRotateY(angle,this);
    }

    public rotateZ(angle: number): Matrix4 {
        return Matrix4.createRotateZ(angle,this);
    }

    // return a copy of this object
    // const function
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
    // const function
    public elementAt(i: number, j: number) {
        return this.elements[i * 4 + j];
    }

    // print this object (4x4 matrix) 
    // ONLY for debugging
    // const function
    public print() {
        console.log(this.elements[0], this.elements[1], this.elements[2], this.elements[3]);
        console.log(this.elements[4], this.elements[5], this.elements[6], this.elements[7]);
        console.log(this.elements[8], this.elements[9], this.elements[10], this.elements[11]);
        console.log(this.elements[12], this.elements[13], this.elements[14], this.elements[15]);
    }

    // return self .* vec
    // the return vector (Vec4) is a column vector
    // const function
    public mulVec4(v: Vec4): Vec4 {
        var result = new Vec4();
        result.x = this.elements[0] * v.x + this.elements[1] * v.y + this.elements[2] * v.z + this.elements[3] * v.w;
        result.y = this.elements[4] * v.x + this.elements[5] * v.y + this.elements[6] * v.z + this.elements[7] * v.w;
        result.z = this.elements[8] * v.x + this.elements[9] * v.y + this.elements[10] * v.z + this.elements[11] * v.w;
        result.w = this.elements[12] * v.x + this.elements[13] * v.y + this.elements[14] * v.z + this.elements[15] * v.w;
        return result;
    }

    // return self .* (x, y, z, 1)
    // const function
    public mulVec3(v: Vec3): Vec4 {
        var tmp = new Vec4(v.x, v.y, v.z, 1.0);
        return this.mulVec4(tmp);
    }

    // return self .* mat4
    // const function
    public mulMat4(mat4: Matrix4): Matrix4 {
        var result = new Matrix4();
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var tmp = 0;
                for (var t = 0; t < 4; t++) {
                    tmp += this.elementAt(i, t) * mat4.elementAt(t, j);
                }
                result.elements[i * 4 + j] = tmp;
            }
        }
        return result;
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

        return this;
    }

    // swap two position's value of this elements matrix
    private swapPosition(i: number, j: number) {
        let tmp = this.elements[i];
        this.elements[i] = this.elements[j];
        this.elements[j] = tmp;
    }
}