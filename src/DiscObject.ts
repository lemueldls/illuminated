import { Bounds, getTan2, path } from "./utils";
import { _2PI } from "./constants";
import OpaqueObject, { OpaqueObjectOptions } from "./OpaqueObject";

import Vec2 from "./Vec2";

/**
 * Options to be applied to this disc object.
 *
 * @typedef {Object} DiscObjectOptions
 * @property {Vec2} center - Position of the disc object.
 * @property {number} radius - Size of the disc object.
 * @property {number} diffuse - How diffuse this opaque object should be.
 */
export type DiscObjectOptions =
  // eslint-disable-next-line no-use-before-define
  Partial<Pick<DiscObject, "center" | "radius"> & OpaqueObjectOptions>;

/**
 * A circular, opaque object.
 *
 * @class DiscObject
 * @extends OpaqueObject
 */
export default class DiscObject extends OpaqueObject {
  /**
   * Position of the disc object.
   *
   * @type {Vec2}
   * @default new Vec2()
   */
  public center: Vec2 = new Vec2();

  /**
   * Size of the disc object.
   *
   * @type {number}
   * @default 20
   */
  public radius = 20;

  /**
   * @constructor
   * @param {DiscObjectOptions} [options={}] - Options to be applied to this disc object.
   * @param {Vec2} [options.center] - Position of the disc object.
   * @param {number} [options.radius] - Size of the disc object.
   * @param {number} [options.diffuse] - How diffuse this disc object should be.
   */
  public constructor(options: DiscObjectOptions = {}) {
    super(options);

    const { center, radius } = options;

    this.center = center ?? this.center;
    this.radius = radius ?? this.radius;
  }

  /**
   * Fill ctx with the shadows projected by this disc object from the origin
   * point, constrained by the given bounds.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context onto which the shadows will be cast.
   * @param {Vec2} origin - A vector that represents the origin for the casted shadows.
   * @param {Bounds} bounds - An anonymous object with the properties topleft and bottomright.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public cast(ctx: CanvasRenderingContext2D, origin: Vec2, bounds: Bounds): void {
    const m = this.center;
    let originToM = m.sub(origin);

    // FIXED: this method was wrong... TODO must see http://en.wikipedia.org/wiki/Tangent_lines_to_circles
    // const d = new Vec2(originToM.y, -originToM.x).normalize().mul(this.radius);

    // const a = this.center.add(d);
    // const b = this.center.add(d.inv());

    // let originToA = a.sub(origin);
    // let originToB = b.sub(origin);

    const tangentLines = getTan2(this.radius, originToM);
    let originToA = tangentLines[0];
    let originToB = tangentLines[1];
    const a = originToA.add(origin);
    const b = originToB.add(origin);

    // normalize to distance
    const distance =
      (bounds.bottomright.x - bounds.topleft.x + (bounds.bottomright.y - bounds.topleft.y)) / 2;
    originToM = originToM.normalize().mul(distance);
    originToA = originToA.normalize().mul(distance);
    originToB = originToB.normalize().mul(distance);

    // project points
    const oam = a.add(originToM);
    const obm = b.add(originToM);
    const ap = a.add(originToA);
    const bp = b.add(originToB);

    const start = Math.atan2(originToM.x, -originToM.y);
    ctx.beginPath();
    path(ctx, [b, bp, obm, oam, ap, a], true);
    ctx.arc(m.x, m.y, this.radius, start, start + Math.PI);
    ctx.fill();
  }

  /**
   * Draw the path of the disc onto the ctx.
   *
   * @param {CanvasRenderingContext2D} ctx - The context onto which the path will be drawn.
   */
  public path(ctx: CanvasRenderingContext2D): void {
    ctx.arc(this.center.x, this.center.y, this.radius, 0, _2PI);
  }

  /**
   * Calculate the boundaries of this disc object.
   *
   * @return {Bounds} An anonymous object with the properties topleft and bottomright.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public bounds(): Bounds {
    return {
      topleft: new Vec2(this.center.x - this.radius, this.center.y - this.radius),
      bottomright: new Vec2(this.center.x + this.radius, this.center.y + this.radius)
    };
  }

  /**
   * Determine if the given point is inside the disc.
   *
   * @param {Vec2} point - The point to be checked.
   * @return {boolean} True if the disc object contains the given point.
   */
  public contains(point: Vec2): boolean {
    return point.dist2(this.center) < this.radius * this.radius;
  }
}
