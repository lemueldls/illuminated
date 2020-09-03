import { Bounds } from "./types";
import { GOLDEN_ANGLE } from "./constants";
import Light, { LightOptions } from "./Light";
import { createCanvasAnd2dContext, CanvasAndContext, getRGBA } from "./utils";
import Vec2 from "./Vec2";

export type LampOptions = Partial<
  // eslint-disable-next-line no-use-before-define
  Pick<Lamp, "color" | "radius" | "samples" | "angle" | "roughness">
> &
  LightOptions;

/**
 * A circular light rendered as a radial gradient.
 * Lamps can also be "oriented" in a specific direction.
 */
export default class Lamp extends Light {
  #uniqueId = 0;

  #cacheHashcode!: string;

  #gcache!: CanvasAndContext;

  /**
   * The id of this light object.
   *
   * @default 0;
   */
  public id = 0;

  /**
   * The color emitted by the lamp. The color can be specified in any CSS format.
   *
   * @default "rgba(250,220,150,0.8)";
   */
  public color = "rgba(250,220,150,0.8)";

  /**
   * The size of the lamp. Bigger lamps cast smoother shadows.
   *
   * @default 0;
   */
  public radius = 0;

  /**
   * The number of points which will be used for shadow projection. It defines
   * the quality of the rendering.
   *
   * @default 1;
   */
  public samples = 1;

  /**
   * The angle of the orientation of the lamp.
   *
   * @default 0;
   */
  public angle = 0;

  /**
   * The roughness of the oriented effect.
   *
   * @default 0;
   */
  public roughness = 0;

  /**
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
   * @param options - Options to be applied to this lamp.
   * @param options.position - Position of this lamp. (0,0) by default.
   * @param options.distance - Intensity of this lamp.
   * @param options.diffuse - How diffuse this lamp is.
   * @param options.color - The color emitted by the lamp.
   * The color can be specified in any CSS format.
   * @param options.radius - The size of the lamp. Bigger lamps cast smoother shadows.
   * @param options.samples - The number of points which will be used for shadow projection.
   * It defines the quality of the rendering.
   * @param options.angle - The angle of the orientation of the lamp.
   * @param options.roughness - The roughness of the oriented effect.
   */
  public constructor(options: LampOptions = {}) {
    super(options);

    const { color, radius, samples, angle, roughness } = options as LampOptions;

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
   * @returns The hash key.
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
   * @returns A new vector that represents the center of this lamp.
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
   * @returns An anonymous object with the properties topleft and bottomright.
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
   * @param ctx - The canvas context onto which the mask will be rendered.
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
   * @param center - The position of the center of the gradient to render.
   */
  private getGradientCache(center: Vec2) {
    const hashcode = this.getHashCache();

    if (this.#cacheHashcode === hashcode) {
      return this.#gcache;
    }
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
   * @param ctx - The canvas context onto which the light will be rendered.
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
   * Invoke a function for every sample generated by this lamp.
   * The samples for lamps are generated using a "spiral" algorithm.
   *
   * @param f - Function to be called for every sample.
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
