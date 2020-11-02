import { Bounds } from "./utils";
import Vec2 from "./Vec2";

/**
 * Options to be applied to this opaque object.
 *
 * @typedef {Object} OpaqueObjectOptions
 * @property {number} diffuse - How diffuse this opaque object should be.
 */
export type OpaqueObjectOptions =
  // eslint-disable-next-line no-use-before-define
  Partial<Pick<OpaqueObject, "diffuse">>;

/**
 * Class for opaque objects.
 *
 * @class OpaqueObject
 */
export default class OpaqueObject {
  /** @type {number} */
  public uniqueId = 0;

  /**
   * How diffuse this opaque object should be.
   *
   * @type {number}
   * @default 0.8
   */
  public diffuse = 0.8;

  /**
   * @constructor
   * @param {OpaqueObjectOptions} [options={}] - Options to be applied to this opaque object.
   * @param {number} [options.diffuse] - How diffuse this opaque object should be.
   */
  public constructor(options: OpaqueObjectOptions = {}) {
    const { diffuse } = options;

    this.diffuse = diffuse ?? this.diffuse;
  }

  /**
   * Calculate the boundaries of this opaque object.
   *
   * @return {Bounds} An anonymous object with the properties `topleft` and `bottomright`.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public bounds(): Bounds {
    return { topleft: new Vec2(), bottomright: new Vec2() };
  }

  /**
   * Fill ctx with the shadows projected by this opaque object at the origin point,
   * constrained by the given bounds.
   *
   * @param {CanvasRenderingContext2D} _ctx - The canvas context onto which the shadows will be cast.
   * @param {Vec2} _origin - A vector that represents the origin for the casted shadows.
   * @param {Bounds} _bounds - An anonymous object with the properties `topleft` and `bottomright`.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public cast(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ctx: CanvasRenderingContext2D,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _origin: Vec2,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _bounds: Bounds
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ): void {}

  /**
   * Draw the path of the polygon onto the ctx.
   *
   * @param {CanvasRenderingContext2D} _ctx - The context onto which the path will be drawn.
   */
  public path(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ctx: CanvasRenderingContext2D
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ): void {}

  /**
   * Determine if the given point is inside the polygon.
   *
   * @param {Vec2} _point - The point to be checked.
   * @return {boolean} True if the polygon object contains the given point.
   */
  public contains(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _point: Vec2
  ): boolean {
    return false;
  }
}
