import PolygonObject, { PolygonObjectOptions } from "./PolygonObject";
import Vec2 from "./Vec2";

/**
 * Options to be applied to this rectangle object.
 *
 * @typedef RectangleObjectOptions
 * @property {number} [diffuse] - How diffuse this polygon object should be.
 * @property {Vec2} [topleft] - A vector that is the top-left of the rectangle.
 * @property {Vec2} [bottomright] - A vector that is the bottom-right of the rectangle.
 */
export type RectangleObjectOptions =
  // eslint-disable-next-line no-use-before-define
  Partial<Pick<RectangleObject, "topleft" | "bottomright"> & PolygonObjectOptions>;

/**
 * A rectangular, opaque object.
 *
 * @class RectangleObject
 * @extends PolygonObject
 */
export default class RectangleObject extends PolygonObject {
  /**
   * A vector that is the top-left of the rectangle.
   *
   * @type {Vec2}
   * @default new Vec2()
   */
  public topleft: Vec2;

  /**
   * A vector that is the bottom-right of the rectangle.
   *
   * @type {Vec2}
   * @default new Vec2()
   */
  public bottomright: Vec2;

  /**
   * @constructor
   * @param {RectangleObjectOptions} [options={}] - Options to be applied to this rectangle object.
   * @param {number} [options.diffuse] - How diffuse this polygon object should be.
   * @param {Vec2} [options.topleft] - A vector that is the top-left of the rectangle.
   * @param {Vec2} [options.bottomright] - A vector that is the bottom-right of the rectangle.
   */
  public constructor(options: RectangleObjectOptions = {}) {
    super(options);

    const { topleft, bottomright } = options;

    this.topleft = topleft ?? new Vec2();
    this.bottomright = bottomright ?? new Vec2();

    this.syncFromTopleftBottomright();
  }

  /**
   * Initializes the points defining this rectangle based on its specified bounds.
   */
  private syncFromTopleftBottomright(): void {
    const { topleft, bottomright } = this;

    const topright = new Vec2(bottomright.x, topleft.y);
    const bottomleft = new Vec2(topleft.x, bottomright.y);

    this.points = [topleft, topright, bottomright, bottomleft];
  }

  /**
   * Draws this rectangle onto the given context
   *
   * @param {CanvasRenderingContext2D} context -The canvas context onto which the rectangle should be drawn.
   */
  public fill(context: CanvasRenderingContext2D): void {
    const [{ x: x1, y: y1 }, , { x: x2, y: y2 }] = this.points;

    context.rect(x1, y1, x2 - x1, y2 - y1);
  }
}
