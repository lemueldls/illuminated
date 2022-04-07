import PolygonObject, { type PolygonObjectOptions } from "./PolygonObject";
import Vec2 from "./Vec2";

/**
 * Options to be applied to the rectangle object.
 */
export type RectangleObjectOptions = Partial<
  Pick<RectangleObject, "topLeft" | "bottomRight"> & PolygonObjectOptions
>;

/**
 * A rectangular, opaque object.
 */
export default class RectangleObject extends PolygonObject {
  /**
   * A vector that is the top-left of the rectangle.
   *
   * @default new Vec2()
   */
  public topLeft: Vec2;

  /**
   * A vector that is the bottom-right of the rectangle.
   *
   * @default new Vec2()
   */
  public bottomRight: Vec2;

  /**
   * @param options - Options to be applied to the rectangle object.
   */
  public constructor(options: RectangleObjectOptions = {}) {
    super(options);

    const { topLeft, bottomRight } = options;

    this.topLeft = topLeft ?? new Vec2();
    this.bottomRight = bottomRight ?? new Vec2();

    this.syncFromTopleftBottomright();
  }

  /**
   * Initializes the points defining the rectangle based on its specified bounds.
   */
  private syncFromTopleftBottomright(): void {
    const { topLeft, bottomRight } = this;

    const topRight = new Vec2(bottomRight.x, topLeft.y);
    const bottomLeft = new Vec2(topLeft.x, bottomRight.y);

    this.points = [topLeft, topRight, bottomRight, bottomLeft];
  }

  /**
   * Draws the rectangle onto the given context
   *
   * @param context - The canvas context onto which the rectangle should be drawn.
   */
  public fill(context: CanvasRenderingContext2D): void {
    const [{ x: x1, y: y1 }, , { x: x2, y: y2 }] = this.points;

    context.rect(x1, y1, x2 - x1, y2 - y1);
  }
}
