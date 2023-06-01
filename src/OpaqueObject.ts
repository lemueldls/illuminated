import Vec2 from "./Vec2";

import type { Bounds } from "./utils";

/**
 * Options to be applied to the opaque object.
 */
export type OpaqueObjectOptions = Partial<Pick<OpaqueObject, "diffuse">>;

/**
 * An opaque object.
 */
export default class OpaqueObject {
  /**
   * How diffuse the opaque object should be.
   *
   * @default 0.8
   */
  public diffuse: number;

  /**
   * @param options - Options to be applied to the opaque object.
   */
  public constructor(options: OpaqueObjectOptions = {}) {
    const { diffuse } = options;

    this.diffuse = diffuse ?? 0.8;
  }

  /**
   * Calculate the boundaries of the opaque object.
   *
   * @returns An anonymous object with the properties `topLeft` and `bottomRight`.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public bounds(): Bounds {
    return { topLeft: new Vec2(), bottomRight: new Vec2() };
  }

  /**
   * Fill ctx with the shadows projected by the opaque object at the origin point,
   * constrained by the given bounds.
   *
   * @param _context - The canvas context onto which the shadows will be cast.
   * @param _origin - A vector that represents the origin for the casted shadows.
   * @param _bounds - An anonymous object with the properties `topLeft` and `bottomRight`.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public cast(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: CanvasRenderingContext2D,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _origin: Vec2,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _bounds: Bounds
  ): void {
    //
  }

  /**
   * Draw the path of the polygon onto the ctx.
   *
   * @param _context - The context onto which the path will be drawn.
   */
  public path(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: CanvasRenderingContext2D
  ): void {
    //
  }

  /**
   * Determine if the given point is inside the polygon.
   *
   * @param _point - The point to be checked.
   * @returns `true` if the polygon object contains the given point.
   */
  public contains(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _point: Vec2
  ): boolean {
    return false;
  }
}
