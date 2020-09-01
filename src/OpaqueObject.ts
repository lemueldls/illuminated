import { Bounds } from "./bounds";
import Vec2 from "./Vec2";

// eslint-disable-next-line no-use-before-define
export type OpaqueObjectOptions = Partial<Pick<OpaqueObject, "diffuse">>;

/**
 * Class for opaque objects.
 */
export default class OpaqueObject {
  public uniqueId = 0;

  /**
   * How diffuse this opaque object should be.
   */
  public diffuse = 0.8;

  /**
   * @param options - Options to be applied to this opaque object.
   * @param options.diffuse - How diffuse this opaque object should be.
   */
  public constructor({ diffuse }: OpaqueObjectOptions) {
    this.diffuse = diffuse ?? this.diffuse;
  }

  /**
   * Calculate the boundaries of this opaque object.
   *
   * @returns An anonymous object with the properties topleft and bottomright.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public bounds(): Bounds {
    return { topleft: new Vec2(), bottomright: new Vec2() };
  }

  /**
   * Fill ctx with the shadows projected by this opaque object at the origin point,
   * constrained by the given bounds.
   *
   * @param _ctx - The canvas context onto which the shadows will be cast.
   * @param _origin - A vector that represents the origin for the casted shadows.
   * @param _bounds - An anonymous object with the properties topleft and bottomright.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  public cast(_ctx: CanvasRenderingContext2D, _position: Vec2, _bounds: Bounds): void {
    throw new Error("Method not implemented.");
  }

  /**
   * Draw the path of the polygon onto the ctx.
   *
   * @param _ctx - The context onto which the path will be drawn.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  public path(_ctx: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.");
  }

  /**
   * Determine if the given point is inside the polygon.
   *
   * @param _point - The point to be checked.
   * @returns True if the polygon object contains the given point.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  public contains(_point: Vec2): boolean {
    return false;
  }
}
