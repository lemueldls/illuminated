import { GOLDEN_ANGLE } from "./constants";
import Light, { type LightOptions } from "./Light";
import { createCanvasAnd2dContext, getRGBA, type Bounds, type CanvasAndContext } from "./utils";
import Vec2 from "./Vec2";

/**
 * Options to be applied to the lamp.
 */
export type LampOptions = Partial<
  Pick<Lamp, "id" | "color" | "radius" | "samples" | "angle" | "roughness"> & LightOptions
>;

/**
 * A circular light rendered as a radial gradient.
 * Lamps can also be "oriented" in a specific direction.
 */
export default class Lamp extends Light {
  /**
   * The id of the light object.
   *
   * @default 0
   */
  public id: number;

  /**
   * The color emitted by the lamp. The color can be specified in any CSS format.
   *
   * @default "rgba(250,220,150,0.8)"
   */
  public color: string;

  /**
   * The size of the lamp. Bigger lamps cast smoother shadows.
   *
   * @default 0
   */
  public radius: number;

  /**
   * The angle of the orientation of the lamp.
   *
   * @default 0
   */
  public angle: number;

  /**
   * The roughness of the oriented effect.
   *
   * @default 0
   */
  public roughness: number;

  static #uniqueId = 0;

  #cacheHashcode?: string;

  #gcache?: CanvasAndContext;

  /**
   * @param options - Options to be applied to the lamp.
   *
   * @example
   * ```
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
   */
  public constructor(options: LampOptions = {}) {
    super(options);

    const { id, color, radius, angle, roughness } = options;

    this.id = id ?? 0;
    this.color = color ?? "rgba(250,220,150,0.8)";
    this.radius = radius ?? 0;
    this.angle = angle ?? 0;
    this.roughness = roughness ?? 0;

    if (this.id === 0) this.id = ++Lamp.#uniqueId;
  }

  /**
   * Return a string hash key representing the lamp.
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
   * Return the center of the lamp.
   * i.e. The position where the lamp intensity is the highest
   *
   * @returns A new vector that represents the center of the lamp.
   */
  public center(): Vec2 {
    const { angle, roughness, distance } = this;

    return new Vec2(
      (1 - Math.cos(angle) * roughness) * distance,
      (1 + Math.sin(angle) * roughness) * distance
    );
  }

  /**
   * Calculate the boundaries of the lamp based on its properties.
   *
   * @returns An anonymous object with the properties `topLeft` and `bottomRight`.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public bounds(): Bounds {
    const { angle, roughness, distance, position } = this;

    const { x, y } = new Vec2(Math.cos(angle), -Math.sin(angle)).mul(roughness * distance);

    return {
      topLeft: new Vec2(position.x + x - distance, position.y + y - distance),
      bottomRight: new Vec2(position.x + x + distance, position.y + y + distance)
    };
  }

  /**
   * Render a mask representing the visibility. (Used by {@linkcode DarkMask})
   *
   * @param context - The canvas context onto which the mask will be rendered.
   */
  public mask(context: CanvasRenderingContext2D): void {
    const { angle, roughness, distance, position } = this;

    const { canvas, w, h } = this.getVisibleMaskCache()!;
    const { x, y } = new Vec2(Math.cos(angle), -Math.sin(angle)).mul(roughness * distance);

    context.drawImage(
      canvas,
      Math.round(position.x + x - w / 2),
      Math.round(position.y + y - h / 2)
    );
  }

  /**
   * Renders the lamp's gradient onto a cached canvas at the given position.
   *
   * @param center - The position of the center of the gradient to render.
   */
  private getGradientCache(center: Vec2): CanvasAndContext | undefined {
    const hashcode = this.getHashCache();

    if (this.#cacheHashcode === hashcode) return this.#gcache;

    this.#cacheHashcode = hashcode;

    const { distance, id, radius, color } = this;

    const d = Math.round(distance);
    const D = d * 2;

    const cache = createCanvasAnd2dContext(`gc${id}`, D, D);
    const { ctx, w, h } = cache;

    const gradient = ctx.createRadialGradient(center.x, center.y, 0, d, d, d);

    gradient.addColorStop(Math.min(1, radius / distance), color);
    gradient.addColorStop(1, getRGBA(color, 0));

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    this.#gcache = cache;

    return cache;
  }

  /**
   * Render the lamp onto the given context (without any shadows).
   *
   * @param context - The canvas context onto which the light will be rendered.
   */
  public render(context: CanvasRenderingContext2D): void {
    const { x, y } = this.position;

    const center = this.center();
    const { canvas } = this.getGradientCache(center)!;

    context.drawImage(canvas, Math.round(x - center.x), Math.round(y - center.y));
  }

  /**
   * Invoke a function for every sample generated by the lamp.
   * The samples for lamps are generated using a "spiral" algorithm.
   *
   * @param callback - Function to be called for every sample.
   * The function will be passed a vector representing the position of the sample.
   */
  public forEachSample(callback: (position: Vec2) => void): void {
    const { samples, radius, position } = this;

    // "spiral" algorithm for spreading emit samples
    for (let s = 0, l = samples; s < l; ++s) {
      const a = s * GOLDEN_ANGLE;
      const r = Math.sqrt(s / samples) * radius;

      const delta = new Vec2(Math.cos(a) * r, Math.sin(a) * r);

      callback(position.add(delta));
    }
  }
}
