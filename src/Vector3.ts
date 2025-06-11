// X-Y-Z INTRINSIC EULER ORDER

import {Matrix4} from "./Matrix4.ts";
import {Quaternion} from "./Quaternion.ts";

export class Vector3 {
    public static readonly zero: Vector3 = new Vector3(0, 0, 0);
    public static readonly one: Vector3 = new Vector3(1, 1, 1);
    public static readonly up: Vector3 = new Vector3(0, 1, 0);
    public static readonly down: Vector3 = new Vector3(0, -1, 0);
    public static readonly left: Vector3 = new Vector3(-1, 0, 0);
    public static readonly right: Vector3 = new Vector3(1, 0, 0);
    public static readonly forward: Vector3 = new Vector3(0, 0, 1);
    public static readonly back: Vector3 = new Vector3(0, 0, -1);

    public static degToRad(degrees: number): number {
        return degrees * Math.PI / 180;
    }

    public static radToDeg(radians: number): number {
        return radians * 180 / Math.PI;
    }

    public static fromDegrees(degrees: Vector3): Vector3 {
        return new Vector3(degrees.x * Math.PI / 180,
            degrees.y * Math.PI / 180,
            degrees.z * Math.PI / 180
        );
    }

    constructor(public x: number, public y: number, public z: number) {}

    public normalize(): Vector3 {
        const length = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
        return new Vector3(this.x / length, this.y / length, this.z / length);
    }

    public asDegrees(): Vector3 {
        return new Vector3(this.x * 180 / Math.PI, this.y * 180 / Math.PI, this.z * 180 / Math.PI);
    }

    public asArray(): Float32Array {
        return new Float32Array([this.x, this.y, this.z]);
    }

    public set(x: number, y: number, z: number): this {
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    public toString(): string {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }
}