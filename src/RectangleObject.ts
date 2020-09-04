import PolygonObject, { PolygonObjectOptions } from "./PolygonObject";
import Vec2 from "./Vec2";

// eslint-disable-next-line no-use-before-define
export type RectangleObjectOptions = Partial<Pick<RectangleObject, "topleft" | "bottomright">> &
  PolygonObjectOptions;

/**
 * A rectangular, opaque object.
 *
 * @class RectangleObject
 */
export default class RectangleObject extends PolygonObject {
  /**
   * A vector that is the top-left of the rectangle.
   *
   * @type {Vec2}
   * @default new Vec2()
   */
  public topleft: Vec2 = new Vec2();

  /**
   * A vector that is the bottom-right of the rectangle.
   *
   * @type {Vec2}
   * @default new Vec2()
   */
  public bottomright: Vec2 = new Vec2();

  /**
   * @constructor
   * @param {RectangleObjectOptions} [options] - Options to be applied to this rectangle object.
   * @param {Vec2} [options.topleft] - A vector that is the top-left of the rectangle.
   * @param {Vec2} [options.bottomright] - A vector that is the bottom-right of the rectangle.
   */
  public constructor(options: RectangleObjectOptions = {}) {
    super(options);

    const { topleft, bottomright } = options as RectangleObjectOptions;

    this.topleft = topleft ?? this.topleft;
    this.bottomright = bottomright ?? this.bottomright;
  }

  /**
   * Initializes the points defining this rectangle based on its specified bounds.
   */
  public syncFromTopleftBottomright(): void {
    const a = this.topleft;
    const b = new Vec2(this.bottomright.x, this.topleft.y);
    const c = this.bottomright;
    const d = new Vec2(this.topleft.x, this.bottomright.y);

    this.points = [a, b, c, d];
  }

  /**
   * Draws this rectangle onto the given context
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context onto which the rectangle should be drawn.
   */
  public fill(ctx: CanvasRenderingContext2D): void {
    const { x, y } = this.points[0];

    ctx.rect(x, y, this.points[2].x - x, this.points[2].y - y);
  }
}
