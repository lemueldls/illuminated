import { _2PI } from "./constants";
import OpaqueObject, { type OpaqueObjectOptions } from "./OpaqueObject";
import { getTan2, path, type Bounds } from "./utils";
import Vec2 from "./Vec2";

/**
 * Options to be applied to the disc object.
 */
export type DiscObjectOptions = Partial<
  Pick<DiscObject, "center" | "radius"> & OpaqueObjectOptions
>;

/**
 * A circular, opaque object.
 */
export default class DiscObject extends OpaqueObject {
  /**
   * Position of the disc object.
   *
   * @default new Vec2()
   */
  public center: Vec2;

  /**
   * Size of the disc object.
   *
   * @default 20
   */
  public radius: number;

  /**
   * @param options - Options to be applied to this disc object.
   */
  public constructor(options: DiscObjectOptions = {}) {
    super(options);

    const { center, radius } = options;

    this.center = center ?? new Vec2();
    this.radius = radius ?? 20;
  }

  /**
   * Fill context with the shadows projected by the disc object from the origin
   * point, constrained by the given bounds.
   *
   * @param context - The canvas context onto which the shadows will be cast.
   * @param origin - A vector that represents the origin for the casted shadows.
   * @param bounds - An anonymous object with the properties `topLeft` and `bottomRight`.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public cast(context: CanvasRenderingContext2D, origin: Vec2, bounds: Bounds): void {
    const { center, radius } = this;

    let originToM = center.sub(origin);

    let [originToA, originToB] = getTan2(radius, originToM);

    const a = originToA.add(origin);
    const b = originToB.add(origin);

    const { bottomRight, topLeft } = bounds;

    // Normalize to distance
    const distance = (bottomRight.x - topLeft.x + (bottomRight.y - topLeft.y)) / 2;

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
   * @param context - The context onto which the path will be drawn.
   */
  public path(context: CanvasRenderingContext2D): void {
    const { center, radius } = this;

    context.arc(center.x, center.y, radius, 0, _2PI);
  }

  /**
   * Calculate the boundaries of the disc object.
   *
   * @returns An anonymous object with the properties `topLeft` and `bottomRight`.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public bounds(): Bounds {
    const { center, radius } = this;

    return {
      topLeft: new Vec2(center.x - radius, center.y - radius),
      bottomRight: new Vec2(center.x + radius, center.y + radius)
    };
  }

  /**
   * Determine if the given point is inside the disc.
   *
   * @param point - The point to be checked.
   * @returns `true` if the disc object contains the given point.
   */
  public contains(point: Vec2): boolean {
    const { center, radius } = this;

    return point.dist2(center) < radius * radius;
  }
}
