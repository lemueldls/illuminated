import { Bounds, path } from "./utils";
import OpaqueObject, { OpaqueObjectOptions } from "./OpaqueObject";

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
  public points: Vec2[] = [];

  /**
   * @constructor
   * @param {PolygonObjectOptions} [options={}] - Options to be applied to this disc object.
   * @param {Vec2} [options.points] - An array of {@linkcode Vec2} points that define the polygon.
   * @param {number} [options.diffuse] - How diffuse this polygon object should be.
   */
  public constructor(options: PolygonObjectOptions = {}) {
    super(options);

    const { points } = options;

    this.points = points ?? this.points;
  }

  /**
   * Calculate the boundaries of this polygon object.
   *
   * @return {Bounds} An anonymous object with the properties topleft and bottomright.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public bounds(): Bounds {
    const first = this.points[0];
    if (!first) throw new Error("There are no points to calculate the boundaries of.");

    const topleft = first.copy();
    const bottomright = topleft.copy();

    for (let p = 1, l = this.points.length; p < l; ++p) {
      const point = this.points[p];
      if (point.x > bottomright.x) bottomright.x = point.x;
      if (point.y > bottomright.y) bottomright.y = point.y;
      if (point.x < topleft.x) topleft.x = point.x;
      if (point.y < topleft.y) topleft.y = point.y;
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
    const l = points.length;
    let j = l - 1;
    const { x } = point;
    const { y } = point;
    let oddNodes = false;

    for (let i = 0; i < l; i++) {
      if (
        ((points[i].y < y && points[j].y >= y) || (points[j].y < y && points[i].y >= y)) &&
        (points[i].x <= x || points[j].x <= x)
      ) {
        if (
          points[i].x +
            ((y - points[i].y) / (points[j].y - points[i].y)) * (points[j].x - points[i].x) <
          x
        )
          oddNodes = !oddNodes;
      }

      j = i;
    }
    return oddNodes;
  }

  /**
   * Draw the path of the polygon onto the ctx.
   *
   * @param {CanvasRenderingContext2D} ctx - The context onto which the path will be drawn.
   */
  public path(ctx: CanvasRenderingContext2D): void {
    path(ctx, this.points);
  }

  /**
   * Fill ctx with the shadows projected by this polygon object from the origin point,
   * constrained by the given bounds.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context onto which the shadows will be cast.
   * @param {Vec2} origin - A vector that represents the origin for the casted shadows.
   * @param {Bounds} bounds - An anonymous object with the properties topleft and bottomright.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public cast(ctx: CanvasRenderingContext2D, origin: Vec2, bounds: Bounds): void {
    // The current implementation of projection is a bit hacky... do you have a proper solution?

    const distance =
      (bounds.bottomright.x - bounds.topleft.x + (bounds.bottomright.y - bounds.topleft.y)) / 2;

    this.forEachVisibleEdges(origin, bounds, (a, b, originToA, originToB, aToB) => {
      let m; // m is the projected point of origin to [a, b]
      const t = originToA.inv().dot(aToB) / aToB.length2();
      if (t < 0) m = a;
      else if (t > 1) m = b;
      else m = a.add(aToB.mul(t));
      let originToM = m.sub(origin);
      // normalize to distance
      originToM = originToM.normalize().mul(distance);

      // project points
      const oam = a.add(originToM);
      const obm = b.add(originToM);
      const ap = a.add(originToA.normalize().mul(distance));
      const bp = b.add(originToB.normalize().mul(distance));

      ctx.beginPath();
      path(ctx, [a, b, bp, obm, oam, ap]);
      ctx.fill();
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
   * @param {Bounds} bounds - An anonymous object with the properties topleft and
   * bottomright. The property values are {@linkcode Vec2} objects representing
   * the corners of the boundary of this polygon.
   * @param {edgeCallback} f - The function to be invoked.
   */
  private forEachVisibleEdges(
    origin: Vec2,
    bounds: Bounds,
    f: (a: Vec2, b: Vec2, originToA: Vec2, originToB: Vec2, aToB: Vec2) => void
  ) {
    let a = this.points[this.points.length - 1];
    let b: Vec2;

    for (let p = 0, l = this.points.length; p < l; ++p, a = b) {
      b = this.points[p];

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
