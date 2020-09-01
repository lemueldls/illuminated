import Light from "./Light";
import { CanvasAndContext, createCanvasAnd2dContext } from "./utils";

// eslint-disable-next-line no-use-before-define
export type DarkMaskOptions = Partial<Pick<DarkMask, "lights" | "color">>;

/**
 * Defines the dark layer which hides the dark area not illuminated by a set of lights.
 */
export default class DarkMask {
  /**
   * An array of {@linkcode Light} objects that illuminate the rest of the scene.
   */
  public lights: Light[] = [];

  /**
   * The color of the dark area in RGBA format.
   */
  public color = "rgba(0,0,0,0.9)";

  #cache!: CanvasAndContext;

  /**
   * @param options - Options to be applied to this light.
   * @param options.lights - An array of {@linkcode Light} objects that
   * illuminate the rest of the scene.
   * @param options.color - The color of the dark area in RGBA format.
   */
  public constructor(options?: DarkMaskOptions) {
    const { lights, color } = options as DarkMaskOptions;

    this.lights = lights ?? this.lights;
    this.color = color ?? this.color;
  }

  /**
   * Compute the dark mask.
   *
   * @param w - Width of the canvas context.
   * @param h - Height of the canvas context.
   */
  compute(w: number, h: number): void {
    if (!this.#cache || this.#cache.w !== w || this.#cache.h !== h)
      this.#cache = createCanvasAnd2dContext("dm", w, h);
    const { ctx } = this.#cache;
    ctx.save();
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "destination-out";
    this.lights.forEach((light) => light.mask(ctx));
    ctx.restore();
  }

  /**
   * Draws the dark mask onto the given context.
   *
   * @param ctx - The canvas context on which to draw.
   */
  render(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.#cache.canvas, 0, 0);
  }

  /**
   * Gives the dark mask back.
   *
   * @returns The canvas context.
   */
  getCanvas(): HTMLCanvasElement {
    return this.#cache.canvas;
  }
}
