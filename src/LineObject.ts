import PolygonObject, { PolygonObjectOptions } from "./PolygonObject";
import Vec2 from "./Vec2";

/**
 * Options to be applied to this line object.
 *
 * @typedef LineObjectOptions
 * @property {Vec2} [a] - A vector that is the first point of the line.
 * @property {Vec2} [b] - A vector that is the last point of the line.
 * @property {Vec2} [points] - An array of [[`Vec2`]] points that define the polygon.
 * @property {number} [diffuse] - How diffuse this polygon object should be.
 */
export type LineObjectOptions =
  // eslint-disable-next-line no-use-before-define
  Partial<Pick<LineObject, "a" | "b"> & PolygonObjectOptions>;

/**
 * An opaque line object
 *
 * @class LineObject
 * @extends PolygonObject
 */
export default class LineObject extends PolygonObject {
  /**
   * A vector that is the first point of the line.
   *
   * @type {Vec2}
   * @default new Vec2()
   */
  public a: Vec2 = new Vec2();

  /**
   * A vector that is the last point of the line.
   *
   * @type {Vec2}
   * @default new Vec2()
   */
  public b: Vec2 = new Vec2();

  /**
   * @constructor
   * @param {LineObjectOptions} [options] - Options to be applied to this line object.
   * @param {Vec2} [options.a] - A vector that is the first point of the line.
   * @param {Vec2} [options.b] - A vector that is the last point of the line.
   * @param {Vec2} [options.points] - An array of {@linkcode Vec2} points that define the polygon.
   * @param {number} [options.diffuse] - How diffuse this polygon object should be.
   */
  public constructor(options: LineObjectOptions = {}) {
    super(options);

    const { a, b } = options;

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
