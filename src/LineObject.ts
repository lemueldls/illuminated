import PolygonObject, { type PolygonObjectOptions } from "./PolygonObject";
import Vec2 from "./Vec2";

/**
 * Options to be applied to the line object.
 */
export type LineObjectOptions = Partial<Pick<LineObject, "a" | "b"> & PolygonObjectOptions>;

/**
 * An opaque line object
 */
export default class LineObject extends PolygonObject {
  /**
   * A vector that is the first point of the line.
   *
   * @default new Vec2()
   */
  public a: Vec2;

  /**
   * A vector that is the last point of the line.
   *
   * @default new Vec2()
   */
  public b: Vec2;

  /**
   * @param options - Options to be applied to the line object.
   */
  public constructor(options: LineObjectOptions = {}) {
    super(options);

    const { a, b } = options;

    this.a = a ?? new Vec2();
    this.b = b ?? new Vec2();

    this.syncFromAB();
  }

  /**
   * Initializes the points defining the line based on its options.
   */
  private syncFromAB(): void {
    this.points = [this.a, this.b];
  }
}
