import Light from "./Light";
import { CanvasAndContext, createCanvasAnd2dContext } from "./utils";

/**
 * Options to be applied to this light.
 *
 * @typedef {Object} DarkMaskOptions
 * @property {Light[]} [lights] - An array of [[`Light`]] objects
 * that illuminate the rest of the scene.
 * @property {string} [color] - The color of the dark area in RGBA format.
 */
export type DarkMaskOptions =
  // eslint-disable-next-line no-use-before-define
  Partial<Pick<DarkMask, "lights" | "color">>;

/**
 * Defines the dark layer which hides the dark area not illuminated by a set of lights.
 *
 * @class DarkMask
 */
export default class DarkMask {
  /**
   * An array of {@linkcode Light} objects that illuminate the rest of the scene.
   *
   * @type {Light[]}
   * @default []
   */
  public lights: Light[];

  /**
   * The color of the dark area in RGBA format.
   *
   * @type {string}
   * @default "rgba(0,0,0,0.9)"
   */
  public color: string;

  /** @type {CanvasAndContext} */
  #cache!: CanvasAndContext;

  /**
   * @constructor
   * @param {DarkMaskOptions} [options={}] - Options to be applied to this light.
   * @param {Light[]} [options.lights] - An array of {@linkcode Light} objects
   * that illuminate the rest of the scene.
   * @param {string} [options.color] - The color of the dark area in RGBA format.
   */
  public constructor(options: DarkMaskOptions = {}) {
    const { lights, color } = options;

    this.lights = lights ?? [];
    this.color = color ?? "rgba(0,0,0,0.9)";
  }

  /**
   * Compute the dark mask.
   *
   * @param {number} width - Width of the canvas context.
   * @param {number} height - Height of the canvas context.
   */
  compute(width: number, height: number): void {
    if (!this.#cache || this.#cache.w !== width || this.#cache.h !== height)
      this.#cache = createCanvasAnd2dContext("dm", width, height);

    const { ctx } = this.#cache;

    ctx.save();

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "destination-out";

    for (const light of this.lights) light.mask(ctx);

    ctx.restore();
  }

  /**
   * Draws the dark mask onto the given context.
   *
   * @param {CanvasRenderingContext2D} context - The canvas context on which to draw.
   */
  render(context: CanvasRenderingContext2D): void {
    context.drawImage(this.#cache.canvas, 0, 0);
  }

  /**
   * Gives the dark mask back.
   *
   * @return {HTMLCanvasElement} The canvas context.
   */
  getCanvas(): HTMLCanvasElement {
    return this.#cache.canvas;
  }
}
