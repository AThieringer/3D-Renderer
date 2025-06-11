// X-Y-Z INTRINSIC EULER ORDER

import {Matrix4} from "./Matrix4.ts";
import {Vector3} from "./Vector3.ts";

export class Quaternion {
    public static readonly identity: Quaternion = new Quaternion(0, 0, 0, 1);

    public static fromAxisAngle(axis: Vector3, angle: number): Quaternion {
        const halfAngle = angle / 2;
        const s = Math.sin(halfAngle);
        const c = Math.cos(halfAngle);

        const normalizedAxis = axis.normalize();

        return new Quaternion(c, normalizedAxis.x * s, normalizedAxis.y * s, normalizedAxis.z * s);
    }

    public static fromEuler(vector: Vector3): Quaternion {
        const halfX = vector.x / 2;
        const halfY = vector.y / 2;
        const halfZ = vector.z / 2;

        const cx = Math.cos(halfX);
        const sx = Math.sin(halfX);
        const cy = Math.cos(halfY);
        const sy = Math.sin(halfY);
        const cz = Math.cos(halfZ);
        const sz = Math.sin(halfZ);

        const qw = cx*cy*cz + sx*sy*sz;
        const qx = sx*cy*cz - cx*sy*sz;
        const qy = cx*sy*cz + sx*cy*sz;
        const qz = cx*cy*sz - sx*sy*cz;

        return new Quaternion(qw, qx, qy, qz);
    }

    public static fromRotationMatrix(matrix: Float32Array, trace: number): Quaternion {
        if (trace > 0) {
            let s = 0.5 / Math.sqrt(trace + 1.0)
            const w = 0.25 / s;
            return new Quaternion(w, (matrix[6] - matrix[9]) * s, (matrix[8] - matrix[2]) * s, (matrix[1] - matrix[4]) * s);
        } else {
            let s = 0.5 / Math.sqrt(1.0 + trace);
            const t = 1.0 / (4.0 * s);
            const qx = (matrix[6] - matrix[9]) * t;
            const qy = (matrix[8] - matrix[2]) * t;
            const qz = (matrix[1] - matrix[4]) * t;
            const qw = 0.25 / s;
            return new Quaternion(qw, qx, qy, qz);
        }
    }

    constructor(public w: number, public x: number, public y: number, public z: number) {}

    public set(w: number, x: number, y: number, z: number): this {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;

        return this.normalize();
    }

    public normalize(): this {
        const length = Math.sqrt(this.w*this.w + this.x*this.x + this.y*this.y + this.z*this.z);

        this.w /= length;
        this.x /= length;
        this.y /= length;
        this.z /= length;

        return this;
    }

    public conjugate(): this {
        return this;
    }

    public invert(): this {
        return this;
    }

    public multiply(quaternion: Quaternion): this {
        return this;
    }

    public dot(quaternion: Quaternion): number {
        return this.w * quaternion.w + this.x * quaternion.x + this.y * quaternion.y + this.z * quaternion.z;
    }

    public rotateVector(vector: Vector3): Vector3 {
        return vector;
    }

    public toRotationMatrix(): Matrix4 {
        return new Matrix4();
    }

    public toEuler(): Vector3 {
        return new Vector3(0, 0, 0);
    }

    public toAxisAngle(): Vector3 {
        return new Vector3(0, 0, 0);
    }

    public magnitude(): number {
        return Math.sqrt(this.w*this.w + this.x*this.x + this.y*this.y + this.z*this.z);
    }

    public magnitudeSquared(): number {
        return this.w*this.w + this.x*this.x + this.y*this.y + this.z*this.z;
    }

    public equals(quaternion: Quaternion, epsilon: number = 1e-6): boolean {
        return Math.abs(this.w - quaternion.w) < epsilon &&
            Math.abs(this.x - quaternion.x) < epsilon &&
            Math.abs(this.y - quaternion.y) < epsilon &&
            Math.abs(this.z - quaternion.z) < epsilon;
    }

    public slerp(quaternion: Quaternion, t: number): this {
        return this;
    }

    public lerp(quaternion: Quaternion, t: number): this {
        return this;
    }

    public toString(): string {
        return `(${this.w}, ${this.x}, ${this.y}, ${this.z})`;
    }
}