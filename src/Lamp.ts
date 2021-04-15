import { GOLDEN_ANGLE } from "./constants";
import Light, { LightOptions } from "./Light";
import { Bounds, CanvasAndContext, createCanvasAnd2dContext, getRGBA } from "./utils";
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
  public id: number;

  /**
   * The color emitted by the lamp. The color can be specified in any CSS format.
   *
   * @type {string}
   * @default "rgba(250,220,150,0.8)"
   */
  public color: string;

  /**
   * The size of the lamp. Bigger lamps cast smoother shadows.
   *
   * @type {number}
   * @default 0
   */
  public radius: number;

  /**
   * The number of points which will be used for shadow projection.
   * It defines the quality of the rendering.
   *
   * @type {number}
   * @default 1
   */
  public samples: number;

  /**
   * The angle of the orientation of the lamp.
   *
   * @type {number}
   * @default 0
   */
  public angle: number;

  /**
   * The roughness of the oriented effect.
   *
   * @type {number}
   * @default 0
   */
  public roughness: number;

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
   *   position: new Vec2(12, 34),
   *   distance: 100,
   *   diffuse: 0.8,
   *   color: "rgba(250,220,150,0.8)",
   *   radius: 0,
   *   samples: 1,
   *   angle: 0,
   *   roughness: 0
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

    this.id = id ?? 0;
    this.color = color ?? "rgba(250,220,150,0.8)";
    this.radius = radius ?? 0;
    this.samples = samples ?? 1;
    this.angle = angle ?? 0;
    this.roughness = roughness ?? 0;

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
    const { angle, roughness, distance } = this;

    return new Vec2(
      (1 - Math.cos(angle) * roughness) * distance,
      (1 + Math.sin(angle) * roughness) * distance
    );
  }

  /**
   * Calculate the boundaries of this lamp based on its properties.
   *
   * @return {Bounds} An anonymous object with the properties `topleft` and `bottomright`.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public bounds(): Bounds {
    const { angle, roughness, distance, position } = this;

    const { x, y } = new Vec2(Math.cos(angle), -Math.sin(angle)).mul(roughness * distance);

    return {
      topleft: new Vec2(position.x + x - distance, position.y + y - distance),
      bottomright: new Vec2(position.x + x + distance, position.y + y + distance)
    };
  }

  /**
   * Render a mask representing the visibility. (Used by {@linkcode DarkMask}.)
   *
   * @param {CanvasRenderingContext2D} context - The canvas context onto which the mask will be rendered.
   */
  public mask(context: CanvasRenderingContext2D): void {
    const { angle, roughness, distance, position } = this;

    const { canvas, w, h } = this.getVisibleMaskCache();
    const { x, y } = new Vec2(Math.cos(angle), -Math.sin(angle)).mul(roughness * distance);

    context.drawImage(
      canvas,
      Math.round(position.x + x - w / 2),
      Math.round(position.y + y - h / 2)
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

    const { distance, id, radius, color } = this;

    const d = Math.round(distance);
    const D = d * 2;

    const cache = createCanvasAnd2dContext(`gc${id}`, D, D);
    const { ctx, w, h } = cache;

    const g = ctx.createRadialGradient(center.x, center.y, 0, d, d, d);

    g.addColorStop(Math.min(1, radius / distance), color);
    g.addColorStop(1, getRGBA(color, 0));

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    this.#gcache = cache;

    return cache;
  }

  /**
   * Render the lamp onto the given context (without any shadows).
   *
   * @param {CanvasRenderingContext2D} context -The canvas context onto which the light will be rendered.
   */
  public render(context: CanvasRenderingContext2D): void {
    const { x, y } = this.position;

    const center = this.center();
    const { canvas } = this.getGradientCache(center);

    context.drawImage(canvas, Math.round(x - center.x), Math.round(y - center.y));
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
    const { samples, radius, position } = this;

    // "spiral" algorithm for spreading emit samples
    for (let s = 0, l = samples; s < l; ++s) {
      const a = s * GOLDEN_ANGLE;
      const r = Math.sqrt(s / samples) * radius;

      const delta = new Vec2(Math.cos(a) * r, Math.sin(a) * r);

      f(position.add(delta));
    }
  }
}
