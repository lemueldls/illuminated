import Light from "./Light";
import OpaqueObject from "./OpaqueObject";
import { CanvasAndContext, createCanvasAnd2dContext } from "./utils";

/**
 * Options to be applied to this light.
 *
 * @typedef LightingOptions
 * @property {Light} [light] - The source of the lighting.
 * @property {OpaqueObject[]} [objects] - An array of [[`OpaqueObject`]]
 * objects which stop the light and create shadows.
 */
export type LightingOptions =
  // eslint-disable-next-line no-use-before-define
  Partial<Pick<Lighting, "light" | "objects">>;

/**
 * Defines the lighting of one light through a set of opaque objects.
 *
 * @class Lighting
 */
export default class Lighting {
  /**
   * The source of the lighting.
   *
   * @type {Light}
   * @default new Light()
   */
  public light: Light = new Light();

  /**
   * An array of {@linkcode OpaqueObject} objects which stop the light and create shadows.
   *
   * @type {OpaqueObject[]}
   * @default []
   */
  public objects: OpaqueObject[] = [];

  /** @type {CanvasAndContext} */
  #cache!: CanvasAndContext;

  /** @type {CanvasAndContext} */
  #castcache!: CanvasAndContext;

  /**
   * @constructor
   * @param {LightingOptions} [options={}] - Options to be applied to this light.
   * @param {Light} [options.light] - The source of the lighting.
   * @param {OpaqueObject[]} [options.objects] - An array of {@linkcode OpaqueObject}
   * objects which stop the light and create shadows.
   */
  public constructor(options: LightingOptions = {}) {
    const { light, objects } = options;

    this.light = light ?? this.light;
    this.objects = objects ?? this.objects;
  }

  /**
   * Create caches for canvas contexts.
   *
   * @param {number} w - Width of the contexts.
   * @param {number} h - Height of the contexts.
   */
  private createCache(w: number, h: number): void {
    this.#cache = createCanvasAnd2dContext("lc", w, h);
    this.#castcache = createCanvasAnd2dContext("lcc", w, h);
  }

  /**
   * Compute the shadows to cast.
   *
   * @param {number} w - Width of the canvas context.
   * @param {number} h - Height of the canvas context.
   */
  public compute(w: number, h: number): void {
    if (!this.#cache || this.#cache.w !== w || this.#cache.h !== h) this.createCache(w, h);

    const { ctx } = this.#cache;
    const { light } = this;

    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    light.render(ctx);
    ctx.globalCompositeOperation = "destination-out";

    this.cast(ctx);
    ctx.restore();
  }

  /**
   * Draw the shadows that are cast by the objects. You usually don't have to use
   * it if you use render().
   *
   * @param {CanvasRenderingContext2D} ctxoutput - The canvas context onto which the shadows will be drawn.
   */
  cast(ctxoutput: CanvasRenderingContext2D): void {
    const { light } = this;

    const n = light.samples;
    const c = this.#castcache;
    const { ctx } = c;

    ctx.clearRect(0, 0, c.w, c.h);
    // Draw shadows for each light sample and objects
    ctx.fillStyle = `rgba(0,0,0,${Math.round(100 / n) / 100})`; // Is there any better way?

    const bounds = light.bounds();
    const { objects } = this;

    light.forEachSample((position) => {
      // const sampleInObject = false;

      for (let o = 0, l = objects.length; o < l; ++o) {
        if (objects[o].contains(position)) {
          ctx.fillRect(
            bounds.topleft.x,
            bounds.topleft.y,
            bounds.bottomright.x - bounds.topleft.x,
            bounds.bottomright.y - bounds.topleft.y
          );
          return;
        }
      }

      objects.forEach((object) => {
        object.cast(ctx, position, bounds);
      });
    });

    // Draw objects diffuse - the intensity of the light penetration in objects
    objects.forEach((object) => {
      let { diffuse } = object;
      diffuse *= light.diffuse;

      ctx.fillStyle = `rgba(0,0,0,${1 - diffuse})`;
      ctx.beginPath();

      object.path(ctx);
      ctx.fill();
    });

    ctxoutput.drawImage(c.canvas, 0, 0);
  }

  /**
   * Draws the light and shadows onto the given context.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context on which to draw.
   */
  public render(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.#cache.canvas, 0, 0);
  }

  /**
   * Returns the light and shadows onto the given context as canvas.
   *
   * @return {HTMLCanvasElement} The picture of the light and shadow.
   */
  public getCanvas(): HTMLCanvasElement {
    return this.#cache.canvas;
  }
}
