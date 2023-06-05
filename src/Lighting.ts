import Light from "./Light";
import { createCanvasAnd2dContext, type CanvasAndContext } from "./utils";

import type OpaqueObject from "./OpaqueObject";

/**
 * Options to be applied to the light.
 */
export type LightingOptions = Partial<Pick<Lighting, "light" | "objects">>;

/**
 * Defines the lighting of one light through a set of opaque objects.
 */
export default class Lighting {
  /**
   * The source of the lighting.
   *
   * @default new Light()
   */
  public light: Light;

  /**
   * An array of {@linkcode OpaqueObject} objects which stop the light and create shadows.
   *
   * @default []
   */
  public objects: OpaqueObject[];

  #cache?: CanvasAndContext;

  #castCache?: CanvasAndContext;

  /**
   * @param options - Options to be applied to the light.
   */
  public constructor(options: LightingOptions = {}) {
    const { light, objects } = options;

    this.light = light ?? new Light();
    this.objects = objects ?? [];
  }

  /**
   * Create caches for canvas contexts.
   *
   * @param w - Width of the contexts.
   * @param h - Height of the contexts.
   */
  private createCache(w: number, h: number): void {
    this.#cache = createCanvasAnd2dContext("lc", w, h);
    this.#castCache = createCanvasAnd2dContext("lcc", w, h);
  }

  /**
   * Compute the shadows to cast.
   *
   * @param w - Width of the canvas context.
   * @param h - Height of the canvas context.
   */
  public compute(w: number, h: number): void {
    if (!this.#cache || this.#cache.w !== w || this.#cache.h !== h) this.createCache(w, h);

    const { ctx } = this.#cache!;

    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.light.render(ctx);
    ctx.globalCompositeOperation = "destination-out";

    this.cast(ctx);
    ctx.restore();
  }

  /**
   * Draw the shadows that are cast by the objects. You usually don't have to use
   * it if you use render().
   *
   * @param ctxoutput - The canvas context onto which the shadows will be drawn.
   */
  public cast(ctxoutput: CanvasRenderingContext2D): void {
    const { ctx, w, h, canvas } = this.#castCache!;

    const { light } = this;

    const n = light.samples;

    ctx.clearRect(0, 0, w, h);
    // Draw shadows for each light sample and objects
    ctx.fillStyle = `rgba(0,0,0,${Math.round(100 / n) / 100})`; // Is there any better way?

    const bounds = light.bounds();
    const { topLeft, bottomRight } = bounds;

    const { objects } = this;

    light.forEachSample((position) => {
      for (let o = 0, l = objects.length; o < l; o++)
        if (objects[o].contains(position)) {
          ctx.fillRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
          return;
        }

      for (const object of objects) object.cast(ctx, position, bounds);
    });

    // Draw objects diffuse - the intensity of the light penetration in objects
    for (const object of objects) {
      let { diffuse } = object;
      diffuse *= light.diffuse;

      ctx.fillStyle = `rgba(0,0,0,${1 - diffuse})`;
      ctx.beginPath();

      object.path(ctx);
      ctx.fill();
    }

    ctxoutput.drawImage(canvas, 0, 0);
  }

  /**
   * Draws the light and shadows onto the given context.
   *
   * @param context - The canvas context on which to draw.
   */
  public render(context: CanvasRenderingContext2D): void {
    context.drawImage(this.#cache!.canvas, 0, 0);
  }

  /**
   * Returns the light and shadows onto the given context as canvas.
   *
   * @returns The picture of the light and shadow.
   */
  public getCanvas(): HTMLCanvasElement {
    return this.#cache!.canvas;
  }
}
