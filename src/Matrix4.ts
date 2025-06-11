// X-Y-Z INTRINSIC EULER ORDER

import {Vector3} from "./Vector3.ts"
import {Quaternion} from "./Quaternion.ts"

export class Matrix4 {
    public elements: Float32Array;

    // MAKE SURE YOU NEVER CALL FUNCTIONS ON THIS
    public static readonly identity: Matrix4 = Object.freeze(new Matrix4());

    constructor(elements?: Float32Array) {
        if (elements) {
            this.elements = new Float32Array(elements);
        } else {
            this.elements = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        }
    }

    public setElements(elements: Float32Array): void {
        this.elements.set(elements);
    }

    public setIdentity(): void {
        this.elements.set(Matrix4.identity.elements);
    }

    public translate(vector: Vector3): this {
        const x = vector.x;
        const y = vector.y;
        const z = vector.z;
        // const w = 0;

        this.elements[3] += this.elements[0]*x + this.elements[1]*y + this.elements[2]*z
        this.elements[7] += this.elements[4]*x + this.elements[5]*y + this.elements[6]*z
        this.elements[11] += this.elements[8]*x + this.elements[9]*y + this.elements[10]*z

        return this;
    }

    // https://msl.cs.uiuc.edu/planning/node102.html
    // Rotates in global Yaw (z) -> Pitch (y) -> Roll (x) order (local XYZ order)
    public rotateEuler(vector: Vector3): Float32Array {
        const roll = vector.x;
        const pitch = vector.y;
        const yaw = vector.z;

        let rotation = new Float32Array(16);

        const sr = Math.sin(roll);
        const cr = Math.cos(roll);
        const sp = Math.sin(pitch);
        const cp = Math.cos(pitch);
        const sy = Math.sin(yaw);
        const cy = Math.cos(yaw);

        rotation[0] = cy * cp;
        rotation[1] = cy * sp * sr - sy * cr;
        rotation[2] = cy * sp * cr + sy * sr;
        rotation[4] = sy * cp;
        rotation[5] = sy * sp * sr + cy * cr;
        rotation[6] = sy * sp * cr - cy * sr;
        rotation[8] = -sp;
        rotation[9] = cp * sr;
        rotation[10] = cp * cr;
        rotation[15] = 1;

        // console.log(rotation);

        return rotation;
    }

    public rotateQuaternion(quaternion: Quaternion): Float32Array {
        let rotation = new Float32Array(16);

        const qx = quaternion.x;
        const qy = quaternion.y;
        const qz = quaternion.z;
        const qw = quaternion.w;



        return rotation;
    }

    public scale(vector: Vector3): this {
        return this;
    }

    public multiply(matrix: Matrix4): this {
        const result = new Float32Array(16);

        for (let col = 0; col < 4; col ++) {
            for (let row = 0; row < 4; row++) {
                result[row + (col << 2)] = this.elements[col] * matrix.elements[row] +
                    this.elements[col + 1] * matrix.elements[row + 4] +
                    this.elements[col + 2] * matrix.elements[row + 8] +
                    this.elements[col + 3] * matrix.elements[row + 12];
            }
        }

        // More efficient implementation similar to gl-matrix
        /* let e0 = this.elements[0],
            e1 = this.elements[1],
            e2 = this.elements[2],
            e3 = this.elements[3],
            e4 = this.elements[4],
            e5 = this.elements[5],
            e6 = this.elements[6],
            e7 = this.elements[7],
            e8 = this.elements[8],
            e9 = this.elements[9],
            e10 = this.elements[10],
            e11 = this.elements[11],
            e12 = this.elements[12],
            e13 = this.elements[13],
            e14 = this.elements[14],
            e15 = this.elements[15]

        let m0 = matrix.elements[0],
            m1 = matrix.elements[1],
            m2 = matrix.elements[2],
            m3 = matrix.elements[3],
            m4 = matrix.elements[4],
            m5 = matrix.elements[5],
            m6 = matrix.elements[6],
            m7 = matrix.elements[7],
            m8 = matrix.elements[8],
            m9 = matrix.elements[9],
            m10 = matrix.elements[10],
            m11 = matrix.elements[11],
            m12 = matrix.elements[12],
            m13 = matrix.elements[13],
            m14 = matrix.elements[14],
            m15 = matrix.elements[15]

        result[0] = e0*m0 + e1*m4 + e2*m8 + e3*m12;
        result[4] = e4*m0 + e5*m4 + e6*m8 + e7*m12;
        result[8] = e8*m0 + e9*m4 + e10*m8 + e11*m12;
        result[12] = e12*m0 + e13*m4 + e14*m8 + e15*m12;

        result[1] = e0*m1 + e1*m5 + e2*m9 + e3*m13;
        result[5] = e4*m1 + e5*m5 + e6*m9 + e7*m13;
        result[9] = e8*m1 + e9*m5 + e10*m9 + e11*m13;
        result[13] = e12*m1 + e13*m5 + e14*m9 + e15*m13;

        result[2] = e0*m2 + e1*m6 + e2*m10 + e3*m14;
        result[6] = e4*m2 + e5*m6 + e6*m10 + e7*m14;
        result[10] = e8*m2 + e9*m6 + e10*m10 + e11*m14;
        result[14] = e12*m2 + e13*m6 + e14*m10 + e15*m14;

        result[3] = e0*m3 + e1*m7 + e2*m11 + e3*m15;
        result[7] = e4*m3 + e5*m7 + e6*m11 + e7*m15;
        result[11] = e8*m3 + e9*m7 + e10*m11 + e11*m15;
        result[15] = e12*m3 + e13*m7 + e14*m11 + e15*m15;*/

        this.elements.set(result);

        return this;
    }

    public invert(): this {
        return this;
    }

    public transpose(): this {
        const e = this.elements;
        let temp: number;

        temp = this.elements[1];
        e[1] = e[4];
        e[4] = temp;

        temp = this.elements[2];
        e[2] = e[8];
        e[8] = temp;

        temp = this.elements[3];
        e[3] = e[12];
        e[12] = temp;

        temp = this.elements[6];
        e[6] = e[9];
        e[9] = temp;

        temp = this.elements[7];
        e[7] = e[13];
        e[13] = temp;

        temp = this.elements[11];
        e[11] = e[14];
        e[14] = temp;

        return this;
    }

    public setPerspective(fov: number, aspect: number, near: number, far: number): this {
        const tanHalfFovInv = 1 / Math.tan(fov / 2);
        const rangeInv = 1 / (near - far);

        const e = this.elements;

        e[1] = 0;
        e[2] = 0;
        e[3] = 0;
        e[4] = 0;
        e[6] = 0;
        e[7] = 0;
        e[8] = 0;
        e[9] = 0;
        e[12] = 0
        e[13] = 0;
        e[14] = -1;
        e[15] = 0;

        e[0] = tanHalfFovInv / aspect;
        e[5] = tanHalfFovInv;
        e[10] = (far + near) / rangeInv;
        e[11] = 2 * far * near * rangeInv;

        console.log(this.toString());

        return this;
    }

    public applyPerspective(fov: number, aspect: number, near: number, far: number): this {
        const tanHalfFovInv = 1 / Math.tan(fov / 2);
        const rangeInv = 1 / (near - far);

        // const e = this.elements;
        const result = new Float32Array(16);

        // 2n / (r - l)
        // 2n / 2r
        // n / r
        // n / (aspect * t)
        // n / (aspect * n * tanHalfFov)
        // 1 / (aspect * tanHalfFov)
        result[0] = tanHalfFovInv / aspect;

        // (r + l) / (r - l)
        // 0 / 2r
        // result[2] = 0;

        // 2n / (t - b)
        // 2n / 2t
        // n / t
        // n / (n * tanHalfFov)
        // 1 / tanHalfFov
        result[5] = tanHalfFovInv;

        // (t + b) / (t - b)
        // 0 / 2t
        // result[6] = 0;

        // -(f + n) / (f - n)
        result[10] = (far + near) / rangeInv;

        // - (2f * n) / (f - n)
        result[11] = 2 * far * near * rangeInv;

        result[14] = -1;

        return this.multiply(new Matrix4(result));
    }

    public setOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): this {
        return this;
    }

    public setLookAt(eye: Vector3, target: Vector3, up: Vector3): this {
        return this;
    }

    public orthogonalize(): this {
        let e = this.elements;
        const q = new Float32Array(9);

        q[0] = e[0];
        q[1] = e[1];
        q[2] = e[2];
        q[3] = e[4];
        q[4] = e[5];
        q[5] = e[6];
        q[6] = e[8];
        q[7] = e[9];
        q[8] = e[10];

        const trace = e[0] + e[5] + e[10];

        const quat = Quaternion.fromRotationMatrix(q, trace);

        return this;
    }

    public transformVector(vector: Vector3): Vector3 {
        const x = vector.x;
        const y = vector.y;
        const z = vector.z;
        const e = this.elements;

        const outX = e[0]*x + e[1]*y + e[2]*z;
        const outY = e[4]*x + e[5]*y + e[6]*z;
        const outZ = e[8]*x + e[9]*y + e[10]*z;

        return new Vector3(outX, outY, outZ);
    }

    public transformPoint(vector3: Vector3): Vector3 {
        const x = vector3.x;
        const y = vector3.y;
        const z = vector3.z;
        const e = this.elements;

        const outX = e[0]*x + e[1]*y + e[2]*z + e[3];
        const outY = e[4]*x + e[5]*y + e[6]*z + e[7];
        const outZ = e[8]*x + e[9]*y + e[10]*z + e[11];
        const outW = e[12]*x + e[13]*y + e[14]*z + e[15];

        if (outW !== 1) {
            return new Vector3(outX / outW, outY / outW, outZ / outW);
        }
        else {
            return new Vector3(outX, outY, outZ);
        }
    }

    public determinant(): number {
        const e = this.elements;

        return 0;
    }

    public toString(): string {
        const e = this.elements;
        return `[${e[0].toFixed(4)} ${e[1].toFixed(4)} ${e[2].toFixed(4)} ${e[3].toFixed(4)}
 ${e[4].toFixed(4)} ${e[5].toFixed(4)} ${e[6].toFixed(4)} ${e[7].toFixed(4)}
 ${e[8].toFixed(4)} ${e[9].toFixed(4)} ${e[10].toFixed(4)} ${e[11].toFixed(4)}
 ${e[12].toFixed(4)} ${e[13].toFixed(4)} ${e[14].toFixed(4)} ${e[15].toFixed(4)}]`;
    }
}



// let arrayData = new Float32Array(16);
// for (let i = 0; i < 16; i++) {
//     arrayData[i] = Math.random();
// }
//
// let testMatrix = new Matrix4(arrayData);
// console.log(testMatrix.toString());
// testMatrix.setIdentity();
// console.log(testMatrix.toString());
// console.log(new Matrix4().toString());
