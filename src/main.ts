// type ColorType = string | CanvasGradient | CanvasPattern;
// interface Dimensions3D { width: number, height: number, depth: number }
// interface Vector { x: number, y: number, z: number }
// interface Coordinate { x: number, y: number }
// interface Drawable {
//   draw(ctx: CanvasRenderingContext2D): void,
//   rotateX3D(theta: number): void,
//   rotateY3D(theta: number): void,
//   rotateZ3D(theta: number): void,
// }
//
// class Cuboid {
//   private readonly x_offset: number;
//   private readonly y_offset: number;
//   private readonly z_offset: number;
//   private edges: [number, number][];
//   private nodes: [number, number, number][];
//
//   constructor(private position: Vector,
//               dimensions: Dimensions3D,
//               private node_color: ColorType="rgb(40, 168, 107)",
//               private edge_color: ColorType="rgb(34, 68, 204)",) {
//     this.x_offset = dimensions.width >> 1;
//     this.y_offset = dimensions.height >> 1;
//     this.z_offset = dimensions.depth >> 1;
//
//     this.edges = [
//       [0, 1], [1, 3], [3, 2], [2, 0],
//       [4, 5], [5, 7], [7, 6], [6, 4],
//       [0, 4], [1, 5], [2, 6], [3, 7]
//     ]
//
//     this.nodes = [
//         [-this.x_offset, -this.y_offset, position.z - this.z_offset],
//         [-this.x_offset, -this.y_offset, position.z + this.z_offset],
//         [-this.x_offset, +this.y_offset, position.z - this.z_offset],
//         [-this.x_offset, +this.y_offset, position.z + this.z_offset],
//         [+this.x_offset, -this.y_offset, position.z - this.z_offset],
//         [+this.x_offset, -this.y_offset, position.z + this.z_offset],
//         [+this.x_offset, +this.y_offset, position.z - this.z_offset],
//         [+this.x_offset, +this.y_offset, position.z + this.z_offset]
//     ]
//
//     this.rotateX3D(45);
//     this.rotateY3D(45);
//   }
//
//   public rotateX3D(theta: number): void {
//     let sinTheta = Math.sin(theta);
//     let cosTheta = Math.cos(theta);
//
//     this.nodes = this.nodes.map(node => {
//       return [
//         node[0],
//         node[1] * cosTheta - node[2] * sinTheta,
//         node[1] * sinTheta + node[2] * cosTheta
//       ]
//     })
//   }
//
//   public rotateY3D(theta: number): void {
//     let sinTheta = Math.sin(theta);
//     let cosTheta = Math.cos(theta);
//
//     this.nodes = this.nodes.map(node => {
//       return [
//         node[0] * cosTheta - node[2] * sinTheta,
//         node[1],
//         node[0] * sinTheta + node[2] * cosTheta
//       ]
//     })
//   }
//
//   public rotateZ3D(theta: number): void {
//     let sinTheta = Math.sin(theta);
//     let cosTheta = Math.cos(theta);
//
//     this.nodes = this.nodes.map(node => {
//       return [
//         node[0] * cosTheta - node[1] * sinTheta,
//         node[0] * sinTheta + node[1] * cosTheta,
//         node[2]
//       ]
//     })
//   }
//
//   public draw(ctx: CanvasRenderingContext2D): void {
//     ctx.save()
//     ctx.translate(this.position.x, this.position.y);
//
//     ctx.strokeStyle = this.edge_color;
//
//     this.edges.forEach((edge) => {
//       ctx.beginPath();
//       ctx.moveTo(this.nodes[edge[0]][0], this.nodes[edge[0]][1]);
//       ctx.lineTo(this.nodes[edge[1]][0], this.nodes[edge[1]][1]);
//       ctx.stroke();
//     })
//
//     ctx.fillStyle = this.node_color;
//     this.nodes.forEach((node) => {
//       ctx.beginPath();
//       ctx.ellipse(node[0], node[1], 5, 5, 0, 0, 2 * Math.PI);
//       ctx.fill();
//     })
//
//     ctx.restore()
//   }
// }
//
// class CanvasManager {
//   private readonly canvas: HTMLCanvasElement;
//   public readonly ctx: CanvasRenderingContext2D;
//   public readonly position: Coordinate;
//   public readonly size: Coordinate;
//   private drawableObjects: Drawable[] = [];
//   private dragging: boolean;
//   private mouse_position: Coordinate;
//   private drag_offset: Coordinate;
//   private readonly backgroundColor: ColorType;
//   private readonly scalingFactor: Vector;
//
//   constructor(canvas: HTMLCanvasElement, backgroundColor: ColorType = "#FFF") {
//     if (!(canvas instanceof HTMLCanvasElement)) {
//       throw new Error("Canvas is not an instance of HTMLCanvasElement");
//     } else {
//       this.canvas = canvas;
//     }
//
//     const ctx = this.canvas.getContext("2d");
//
//     if (!ctx) {
//       throw new Error("No context");
//     } else {
//       this.ctx = ctx;
//     }
//
//     const rect = this.canvas.getBoundingClientRect();
//
//     this.position = { x: rect.x, y: rect.y };
//     this.size = { x: rect.width, y: rect.height };
//
//     console.log(this.position);
//
//     this.dragging = false;
//     this.mouse_position = { x: 0, y: 0 };
//     this.drag_offset = { x: 0, y: 0 };
//     this.backgroundColor = backgroundColor;
//     this.scalingFactor = {
//       x: 1e-2,
//       y: 1e-2,
//       z: 1e-2
//     };
//
//     this.initEventListeners();
//     this.draw();
//   }
//
//   private getCanvasMousePos(event: MouseEvent): { x: number; y: number } {
//     const rect = this.canvas.getBoundingClientRect();
//     return {
//       x: event.clientX - rect.left,
//       y: event.clientY - rect.top
//     };
//   }
//
//   private initEventListeners(): void {
//     this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this))
//   }
//
//   private handleMouseDown = (event: MouseEvent): void => {
//     const mousePos = this.getCanvasMousePos(event);
//     if (
//         mousePos.x > this.position.x ||
//         mousePos.x < this.position.x + this.canvas.width ||
//         mousePos.y > this.position.y ||
//         mousePos.y < this.position.y + this.canvas.height
//     ) {
//       this.dragging = true;
//       this.drag_offset = mousePos;
//       this.mouse_position = mousePos;
//
//       document.addEventListener("mousemove", this.handleMouseMove);
//       document.addEventListener("mouseup", this.handleMouseUp);
//     }
//   }
//
//   private handleMouseUp = (): void => {
//     if (!this.dragging) return;
//
//     this.dragging = false;
//     document.removeEventListener("mousemove", this.handleMouseMove);
//     document.removeEventListener("mouseup", this.handleMouseUp);
//
//     requestAnimationFrame(() => this.draw());
//   }
//
//   private handleMouseMove = (event: MouseEvent): void => {
//     if (!this.dragging) return;
//
//     this.drag_offset = this.mouse_position;
//     this.mouse_position = this.getCanvasMousePos(event);
//
//     this.draw();
//   }
//
//   private drawBackground(): void {
//     this.ctx.save()
//
//     this.ctx.fillStyle = this.backgroundColor;
//     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
//
//     this.ctx.restore()
//   }
//
//   public addDrawableObject(objectType: any, ...args: any[]): void {
//     try {
//       let object = new objectType(...args);
//       this.drawableObjects.push(object);
//
//       this.draw();
//     } catch {
//       console.log("Error creating object");
//     }
//   }
//
//   public draw(): void {
//     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//     this.drawBackground();
//
//     let thetas = [
//         (this.mouse_position.y - this.drag_offset.y) * this.scalingFactor.x,
//       (this.mouse_position.x - this.drag_offset.x) * this.scalingFactor.y,
//       0
//     ]
//
//     this.drawableObjects.forEach(obj => {
//       obj.rotateX3D(thetas[0])
//       obj.rotateY3D(thetas[1])
//       obj.rotateZ3D(thetas[2])
//
//       obj.draw(this.ctx)
//     })
//   }
// }
//
// const canvas = new CanvasManager(document.getElementById("drawCanvas") as HTMLCanvasElement);
//
// // let cuboid1 = new Cuboid({x: canvas.size.x >> 1, y: canvas.size.y >> 1, z: 0},
// //     {width: 100, height: 100, depth: 100})
// //
// // cuboid1.draw(canvas.ctx, {x: 0, y: 0, z: 0});
//
// canvas.addDrawableObject(Cuboid,
//   {x: canvas.size.x >> 1, y: canvas.size.y >> 1, z: 0},
//   {width: 100, height: 100, depth: 100}
// );
//
import {Matrix4} from "./Matrix4.ts";
import {Vector3} from "./Vector3.ts";

const iden = Matrix4.identity;

// console.log(iden.toString())

let arrayData = new Float32Array(16);

for (let i = 0; i < 16; i++) {
    arrayData[i] = Math.random();
}

let matrix1 = new Matrix4(arrayData);

for (let i = 0; i < 16; i++) {
    arrayData[i] = Math.random();
}

let matrix2 = new Matrix4(arrayData);

// console.log(matrix1.toString());
//
// console.log(matrix2.toString());

console.log(matrix2.toString());
console.log(matrix2.applyPerspective(80, 2, 0.5, 3.3).toString());
