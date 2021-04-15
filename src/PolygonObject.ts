import OpaqueObject, { OpaqueObjectOptions } from "./OpaqueObject";
import { Bounds, path } from "./utils";
import Vec2 from "./Vec2";

/**
 * Options to be applied to this disc object.
 *
 * @typedef PolygonObjectOptions
 * @property {Vec2} [points] - An array of [[`Vec2`]] points that define the polygon.
 * @property {number} [diffuse] - How diffuse this polygon object should be.
 */
export type PolygonObjectOptions =
  // eslint-disable-next-line no-use-before-define
  Partial<Pick<PolygonObject, "points"> & OpaqueObjectOptions>;

/**
 * An opaque polygon object
 *
 * @class PolygonObject
 * @extends OpaqueObject
 */
export default class PolygonObject extends OpaqueObject {
  /**
   * An array of {@linkcode Vec} points that define the polygon.
   *
   * @type {Vec2[]}
   * @default []
   */
  public points: Vec2[];

  /**
   * @constructor
   * @param {PolygonObjectOptions} [options={}] - Options to be applied to this disc object.
   * @param {Vec2} [options.points] - An array of {@linkcode Vec2} points that define the polygon.
   * @param {number} [options.diffuse] - How diffuse this polygon object should be.
   */
  public constructor(options: PolygonObjectOptions = {}) {
    super(options);

    const { points } = options;

    this.points = points ?? [];
  }

  /**
   * Calculate the boundaries of this polygon object.
   *
   * @return {Bounds} An anonymous object with the properties `topleft` and `bottomright`.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public bounds(): Bounds {
    const [first] = this.points;
    if (!first) throw new Error("There are no points to calculate the boundaries of.");

    const topleft = first.copy();
    const bottomright = topleft.copy();

    for (let p = 1, l = this.points.length; p < l; ++p) {
      const { x, y } = this.points[p];

      if (x > bottomright.x) bottomright.x = x;
      if (y > bottomright.y) bottomright.y = y;
      if (x < topleft.x) topleft.x = x;
      if (y < topleft.y) topleft.y = y;
    }

    return { topleft, bottomright };
  }

  /**
   * Determine if the given point is inside the polygon.
   *
   * @param {Vec2} point - The point to be checked.
   * @return {boolean} True if the polygon object contains the given point.
   */
  public contains(point: Vec2): boolean {
    const { points } = this;

    const { length } = points;
    let index = length - 1;

    const { x, y } = point;

    let oddNodes = false;

    for (let index2 = 0; index2 < length; index2++) {
      const { x: x1, y: y1 } = points[index];
      const { x: x2, y: y2 } = points[index2];

      if (
        ((y2 < y && y1 >= y) || (y1 < y && y2 >= y)) &&
        (x2 <= x || x1 <= x) &&
        x2 + ((y - y2) / (y1 - y2)) * (x1 - x2) < x
      )
        oddNodes = !oddNodes;

      index = index2;
    }

    return oddNodes;
  }

  /**
   * Draw the path of the polygon onto the ctx.
   *
   * @param {CanvasRenderingContext2D} context -The context onto which the path will be drawn.
   */
  public path(context: CanvasRenderingContext2D): void {
    path(context, this.points);
  }

  /**
   * Fill ctx with the shadows projected by this polygon object from the origin point,
   * constrained by the given bounds.
   *
   * @param {CanvasRenderingContext2D} context -The canvas context onto which the shadows will be cast.
   * @param {Vec2} origin - A vector that represents the origin for the casted shadows.
   * @param {Bounds} bounds - An anonymous object with the properties topleft and bottomright.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public cast(context: CanvasRenderingContext2D, origin: Vec2, bounds: Bounds): void {
    // The current implementation of projection is a bit hacky... do you have a proper solution?

    const { bottomright, topleft } = bounds;

    const distance = (bottomright.x - topleft.x + (bottomright.y - topleft.y)) / 2;

    this.forEachVisibleEdges(origin, bounds, (a, b, originToA, originToB, aToB) => {
      /** The projected point of origin to [a, b] */
      let m;

      const t = originToA.inv().dot(aToB) / aToB.length2();

      if (t < 0) m = a;
      else if (t > 1) m = b;
      else m = a.add(aToB.mul(t));

      let originToM = m.sub(origin);

      // Normalize to distance
      originToM = originToM.normalize().mul(distance);

      // project points
      const oam = a.add(originToM);
      const obm = b.add(originToM);

      const ap = a.add(originToA.normalize().mul(distance));
      const bp = b.add(originToB.normalize().mul(distance));

      context.beginPath();

      path(context, [a, b, bp, obm, oam, ap]);

      context.fill();
    });
  }

  /**
   * @callback edgeCallback
   * @param {Vec2} a
   * @param {Vec2} b
   * @param {Vec2} originToA
   * @param {Vec2} originToB
   * @param {Vec2} aToB
   */
  /**
   * Invoke a function for each of the visible edges in this polygon.
   *
   * @param {Vec2} origin - A vector that represents the origin for the casted shadows.
   * @param {Bounds} bounds - An anonymous object with the properties `topleft` and
   * `bottomright`. The property values are {@linkcode Vec2} objects representing
   * the corners of the boundary of this polygon.
   * @param {edgeCallback} f - The function to be invoked.
   */
  private forEachVisibleEdges(
    origin: Vec2,
    bounds: Bounds,
    f: (a: Vec2, b: Vec2, originToA: Vec2, originToB: Vec2, aToB: Vec2) => void
  ) {
    const { points } = this;

    let a = points[points.length - 1];
    let b: Vec2;

    for (let p = 0, l = points.length; p < l; ++p, a = b) {
      b = points[p];

      if (a.inBound(bounds.topleft, bounds.bottomright)) {
        const originToA = a.sub(origin);
        const originToB = b.sub(origin);

        const aToB = b.sub(a);

        const normal = new Vec2(aToB.y, -aToB.x);

        if (normal.dot(originToA) < 0) f(a, b, originToA, originToB, aToB);
      }
    }
  }
}
