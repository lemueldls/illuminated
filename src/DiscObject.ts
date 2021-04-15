import { _2PI } from "./constants";
import OpaqueObject, { OpaqueObjectOptions } from "./OpaqueObject";
import { Bounds, getTan2, path } from "./utils";
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
  public center: Vec2;

  /**
   * Size of the disc object.
   *
   * @type {number}
   * @default 20
   */
  public radius: number;

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

    this.center = center ?? new Vec2();
    this.radius = radius ?? 20;
  }

  /**
   * Fill context with the shadows projected by this disc object from the origin
   * point, constrained by the given bounds.
   *
   * @param {CanvasRenderingContext2D} context - The canvas context onto which the shadows will be cast.
   * @param {Vec2} origin - A vector that represents the origin for the casted shadows.
   * @param {Bounds} bounds - An anonymous object with the properties `topleft` and `bottomright`.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public cast(context: CanvasRenderingContext2D, origin: Vec2, bounds: Bounds): void {
    const { center, radius } = this;

    let originToM = center.sub(origin);

    // FIXED: this method was wrong... TODO must see http://en.wikipedia.org/wiki/Tangent_lines_to_circles
    // const d = new Vec2(originToM.y, -originToM.x).normalize().mul(radius);

    // const a = center.add(d);
    // const b = center.add(d.inv());

    // let originToA = a.sub(origin);
    // let originToB = b.sub(origin);

    const tangentLines = getTan2(radius, originToM);

    let [originToA, originToB] = tangentLines;

    const a = originToA.add(origin);
    const b = originToB.add(origin);

    const { bottomright, topleft } = bounds;

    // Normalize to distance
    const distance = (bottomright.x - topleft.x + (bottomright.y - topleft.y)) / 2;

    originToM = originToM.normalize().mul(distance);
    originToA = originToA.normalize().mul(distance);
    originToB = originToB.normalize().mul(distance);

    // Project points
    const oam = a.add(originToM);
    const obm = b.add(originToM);
    const ap = a.add(originToA);
    const bp = b.add(originToB);

    const start = Math.atan2(originToM.x, -originToM.y);

    context.beginPath();

    path(context, [b, bp, obm, oam, ap, a], true);

    context.arc(center.x, center.y, radius, start, start + Math.PI);
    context.fill();
  }

  /**
   * Draw the path of the disc onto the context.
   *
   * @param {CanvasRenderingContext2D} context - The context onto which the path will be drawn.
   */
  public path(context: CanvasRenderingContext2D): void {
    const { center, radius } = this;

    context.arc(center.x, center.y, radius, 0, _2PI);
  }

  /**
   * Calculate the boundaries of this disc object.
   *
   * @return {Bounds} An anonymous object with the properties `topleft` and `bottomright`.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public bounds(): Bounds {
    const { center, radius } = this;

    return {
      topleft: new Vec2(center.x - radius, center.y - radius),
      bottomright: new Vec2(center.x + radius, center.y + radius)
    };
  }

  /**
   * Determine if the given point is inside the disc.
   *
   * @param {Vec2} point - The point to be checked.
   * @return {boolean} True if the disc object contains the given point.
   */
  public contains(point: Vec2): boolean {
    const { center, radius } = this;

    return point.dist2(center) < radius * radius;
  }
}
