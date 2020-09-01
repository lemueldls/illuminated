import PolygonObject, { PolygonObjectOptions } from "./PolygonObject";
import Vec2 from "./Vec2";

// eslint-disable-next-line no-use-before-define
export type LineObjectOptions = Partial<Pick<LineObject, "a" | "b">> & PolygonObjectOptions;

/**
 * An opaque line object
 */
export default class LineObject extends PolygonObject {
  /**
   * A vector that is the first point of the line.
   *
   * @default new Vec2();
   */
  public a = new Vec2();

  /**
   * A vector that is the last point of the line.
   *
   * @default new Vec2();
   */
  public b = new Vec2();

  /**
   * @param options - Options to be applied to this line object.
   * @param options.a - A vector that is the first point of the line.
   * @param options.b - A vector that is the last point of the line.
   */
  public constructor(options?: LineObjectOptions) {
    super(options);

    const { a, b } = options as LineObjectOptions;

    this.a = a ?? this.a;
    this.b = b ?? this.b;

    this.syncFromAB();
  }

  /**
   * Initializes the points defining this line based on its options.
   */
  private syncFromAB(): void {
    this.points = [this.a, this.b];
  }
}
