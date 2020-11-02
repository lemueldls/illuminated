import { Bounds, createCanvasAnd2dContext, CanvasAndContext, getRGBA } from "./utils";
import { GOLDEN_ANGLE } from "./constants";
import Light, { LightOptions } from "./Light";

import Vec2 from "./Vec2";

/**
 * Options to be applied to this lamp.
 *
 * @typedef LampOptions
 * @property {number} [id] - The id of this light object.
 * @property {string} [color] - The color emitted by the lamp.
 * The color can be specified in any CSS format.
 * @property {number} [radius] - The size of the lamp. Bigger lamps cast smoother shadows.
 * @property {number} [samples] - The number of points which will be
 * used for shadow projection. It defines the quality of the rendering.
 * @property {number} [angle] - The angle of the orientation of the lamp.
 * @property {number} [roughness] - The roughness of the oriented effect.
 * @property {Vec2} [position] - Position of this lamp. (0, 0) by default.
 * @property {number} [distance] - Intensity of this lamp.
 * @property {number} [diffuse] - How diffuse this lamp is.
 */
export type LampOptions =
  // eslint-disable-next-line no-use-before-define
  Partial<Pick<Lamp, "id" | "color" | "radius" | "samples" | "angle" | "roughness"> & LightOptions>;

/**
 * A circular light rendered as a radial gradient.
 * Lamps can also be "oriented" in a specific direction.
 *
 * @class Lamp
 * @extends Light
 */
export default class Lamp extends Light {
  /**
   * The id of this light object.
   *
   * @type {number}
   * @default 0
   */
  public id = 0;

  /**
   * The color emitted by the lamp. The color can be specified in any CSS format.
   *
   * @type {string}
   * @default "rgba(250,220,150,0.8)"
   */
  public color = "rgba(250,220,150,0.8)";

  /**
   * The size of the lamp. Bigger lamps cast smoother shadows.
   *
   * @type {number}
   * @default 0
   */
  public radius = 0;

  /**
   * The number of points which will be used for shadow projection.
   * It defines the quality of the rendering.
   *
   * @type {number}
   * @default 1
   */
  public samples = 1;

  /**
   * The angle of the orientation of the lamp.
   *
   * @type {number}
   * @default 0
   */
  public angle = 0;

  /**
   * The roughness of the oriented effect.
   *
   * @type {number}
   * @default 0
   */
  public roughness = 0;

  /** @type {number} */
  #uniqueId = 0;

  /** @type {string} */
  #cacheHashcode!: string;

  /** @type {CanvasAndContext} */
  #gcache!: CanvasAndContext;

  /**
   * @constructor
   *
   * @example
   * ```typescript
   * new Lamp({
   *  position: new Vec2(12, 34),
   *  distance: 100,
   *  diffuse: 0.8,
   *  color: "rgba(250,220,150,0.8)",
   *  radius: 0,
   *  samples: 1,
   *  angle: 0,
   *  roughness: 0
   * })
   * ```
   *
   * @param {LampOptions} [options={}] - Options to be applied to this lamp.
   * @param {number} [options.id] - The id of this light object.
   * @param {string} [options.color] - The color emitted by the lamp.
   * The color can be specified in any CSS format.
   * @param {number} [options.radius] - The size of the lamp. Bigger lamps cast smoother shadows.
   * @param {number} [options.samples] - The number of points which will be used
   * for shadow projection. It defines the quality of the rendering.
   * @param {number} [options.angle] - The angle of the orientation of the lamp.
   * @param {number} [options.roughness] - The roughness of the oriented effect.
   * @param {Vec2} [options.position] - Position of this lamp. (0, 0) by default.
   * @param {number} [options.distance] - Intensity of this lamp.
   * @param {number} [options.diffuse] - How diffuse this lamp is.
   */
  public constructor(options: LampOptions = {}) {
    super(options);

    const { id, color, radius, samples, angle, roughness } = options;

    this.id = id ?? this.id;
    this.color = color ?? this.color;
    this.radius = radius ?? this.radius;
    this.samples = samples ?? this.samples;
    this.angle = angle ?? this.angle;
    this.roughness = roughness ?? this.roughness;

    if (this.id === 0) this.id = ++this.#uniqueId;
  }

  /**
   * Return a string hash key representing this lamp.
   *
   * @return {string} The hash key.
   */
  protected getHashCache(): string {
    return [
      this.color,
      this.distance,
      this.diffuse,
      this.angle,
      this.roughness,
      this.samples,
      this.radius
    ].toString();
  }

  /**
   * Return the center of this lamp.
   * i.e. The position where the lamp intensity is the highest
   *
   * @return {Vec2} A new vector that represents the center of this lamp.
   */
  public center(): Vec2 {
    return new Vec2(
      (1 - Math.cos(this.angle) * this.roughness) * this.distance,
      (1 + Math.sin(this.angle) * this.roughness) * this.distance
    );
  }

  /**
   * Calculate the boundaries of this lamp based on its properties.
   *
   * @return {Bounds} An anonymous object with the properties `topleft` and `bottomright`.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public bounds(): Bounds {
    const orientationCenter = new Vec2(Math.cos(this.angle), -Math.sin(this.angle)).mul(
      this.roughness * this.distance
    );

    return {
      topleft: new Vec2(
        this.position.x + orientationCenter.x - this.distance,
        this.position.y + orientationCenter.y - this.distance
      ),
      bottomright: new Vec2(
        this.position.x + orientationCenter.x + this.distance,
        this.position.y + orientationCenter.y + this.distance
      )
    };
  }

  /**
   * Render a mask representing the visibility. (Used by {@linkcode DarkMask}.)
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context onto which the mask will be rendered.
   */
  public mask(ctx: CanvasRenderingContext2D): void {
    const c = this.getVisibleMaskCache();
    const orientationCenter = new Vec2(Math.cos(this.angle), -Math.sin(this.angle)).mul(
      this.roughness * this.distance
    );

    ctx.drawImage(
      c.canvas,
      Math.round(this.position.x + orientationCenter.x - c.w / 2),
      Math.round(this.position.y + orientationCenter.y - c.h / 2)
    );
  }

  /**
   * Renders this lamp's gradient onto a cached canvas at the given position.
   *
   * @param {Vec2} center - The position of the center of the gradient to render.
   * @return {CanvasAndContext}
   */
  private getGradientCache(center: Vec2): CanvasAndContext {
    const hashcode = this.getHashCache();

    if (this.#cacheHashcode === hashcode) return this.#gcache;

    this.#cacheHashcode = hashcode;

    const d = Math.round(this.distance);
    const D = d * 2;
    const cache = createCanvasAnd2dContext(`gc${this.id}`, D, D);
    const g = cache.ctx.createRadialGradient(center.x, center.y, 0, d, d, d);

    g.addColorStop(Math.min(1, this.radius / this.distance), this.color);
    g.addColorStop(1, getRGBA(this.color, 0));
    cache.ctx.fillStyle = g;
    cache.ctx.fillRect(0, 0, cache.w, cache.h);
    this.#gcache = cache;

    return cache;
  }

  /**
   * Render the lamp onto the given context (without any shadows).
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context onto which the light will be rendered.
   */
  public render(ctx: CanvasRenderingContext2D): void {
    const center = this.center();
    const c = this.getGradientCache(center);

    ctx.drawImage(
      c.canvas,
      Math.round(this.position.x - center.x),
      Math.round(this.position.y - center.y)
    );
  }

  /**
   * @callback sampleCallback
   * @param {Vec2} v
   */
  /**
   * Invoke a function for every sample generated by this lamp.
   * The samples for lamps are generated using a "spiral" algorithm.
   *
   * @param {sampleCallback} f - Function to be called for every sample.
   * The function will be passed a vector representing the position of the sample.
   */
  public forEachSample(f: (v: Vec2) => void): void {
    // "spiral" algorithm for spreading emit samples
    for (let s = 0, l = this.samples; s < l; ++s) {
      const a = s * GOLDEN_ANGLE;
      const r = Math.sqrt(s / this.samples) * this.radius;
      const delta = new Vec2(Math.cos(a) * r, Math.sin(a) * r);
      f(this.position.add(delta));
    }
  }
}
