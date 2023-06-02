import { createCanvasAnd2dContext, type CanvasAndContext } from "./utils";

import type Light from "./Light";

/**
 * Options to be applied to the dark mask object.
 */
export type DarkMaskOptions = Partial<Pick<DarkMask, "lights" | "color">>;

/**
 * Defines the dark layer which hides the dark area not illuminated by a set of lights.
 */
export default class DarkMask {
  /**
   * An array of {@linkcode Light} objects that illuminate the rest of the scene.
   *
   * @default []
   */
  public lights: Light[];

  /**
   * The color of the dark area in RGBA format.
   *
   * @default "rgba(0,0,0,0.9)"
   */
  public color: string;

  #cache?: CanvasAndContext;

  /**
   * @param options - Options to be applied to the dark mask object.
   */
  public constructor(options: DarkMaskOptions = {}) {
    const { lights, color } = options;

    this.lights = lights ?? [];
    this.color = color ?? "rgba(0,0,0,0.9)";
  }

  /**
   * Compute the dark mask.
   *
   * @param width - Width of the canvas context.
   * @param height - Height of the canvas context.
   */
  public compute(width: number, height: number): void {
    if (!this.#cache || this.#cache.w !== width || this.#cache.h !== height)
      this.#cache = createCanvasAnd2dContext("dm", width, height);

    const { ctx } = this.#cache;

    ctx.save();

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "destination-out";

    for (const light of this.lights) if (!light.hidden) light.mask(ctx);

    ctx.restore();
  }

  /**
   * Draws the dark mask onto the given context.
   *
   * @param context - The canvas context on which to draw.
   */
  public render(context: CanvasRenderingContext2D): void {
    context.drawImage(this.#cache!.canvas, 0, 0);
  }

  /**
   * Gives the dark mask's canvas back.
   *
   * @returns The canvas element.
   */
  public getCanvas(): HTMLCanvasElement {
    return this.#cache!.canvas;
  }
}
