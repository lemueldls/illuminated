import { createCanvasAnd2dContext, type Bounds, type CanvasAndContext } from "./utils";
import Vec2 from "./Vec2";

/**
 * Options to be applied to the light object.
 */
export type LightOptions = Partial<Pick<Light, "position" | "distance" | "diffuse">>;

/**
 * A light object.
 */
export default class Light {
  /**
   * Position of the light object.
   *
   * @default new Vec2()
   */
  public position: Vec2;

  /**
   * Intensity of the light.
   *
   * @default 100
   */
  public distance: number;

  /**
   * How diffuse the light is.
   *
   * @default 0.8
   */
  public diffuse: number;

  public samples?: number;

  protected id?: number;

  #vismaskhash?: string;

  #vismaskcache?: CanvasAndContext;

  /**
   * @param options - Options to be applied to the light object.
   */
  public constructor(options: LightOptions = {}) {
    const { position, distance, diffuse } = options;

    this.position = position ?? new Vec2();
    this.distance = distance ?? 100;
    this.diffuse = diffuse ?? 0.8;
  }

  /**
   * Render the light onto the given context.
   *
   * @param _context - The canvas context onto which the light will be rendered.
   */
  public render(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: CanvasRenderingContext2D
  ): void {
    //
  }

  /**
   * Render a mask representing the visibility. (Used by {@linkcode DarkMask})
   *
   * @param context - The canvas context onto which the mask will be rendered.
   */
  public mask(context: CanvasRenderingContext2D): void {
    const c = this.getVisibleMaskCache()!;

    const { x, y } = this.position;

    context.drawImage(c.canvas, Math.round(x - c.w / 2), Math.round(y - c.h / 2));
  }

  /**
   * Calculate the boundaries of the light using the light's distance.
   *
   * @returns An anonymous object with the properties `topLeft` and `bottomRight`.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public bounds(): Bounds {
    const { position, distance } = this;

    const { x, y } = position;

    return {
      topLeft: new Vec2(x - distance, y - distance),
      bottomRight: new Vec2(x + distance, y + distance)
    };
  }

  /**
   * Return the center of the light.
   * i.e. The position where the light intensity is the highest.
   *
   * @returns A new vector that represents the center of the light.
   */
  public center(): Vec2 {
    const { distance } = this;

    return new Vec2(distance, distance);
  }

  /**
   * Invoke a function for every sample generated by the light.
   * Implement it by spreading samples and calling {@linkcode callback} at each time.
   *
   * @param callback - Function to be called for every sample.
   * The function will be passed a vector representing the position of the sample.
   */
  public forEachSample(callback: (position: Vec2) => void): void {
    callback(this.position);
  }

  /**
   * Creates a canvas context with the visible mask rendered onto it.
   *
   * @returns A canvas context with the visible mask rendered onto it.
   */
  protected getVisibleMaskCache(): CanvasAndContext | undefined {
    // By default use a radial gradient based on the distance
    const d = Math.floor(this.distance * 1.4);
    const hash = `${d}`;

    if (this.#vismaskhash !== hash) {
      this.#vismaskhash = hash;
      this.#vismaskcache = createCanvasAnd2dContext(`vm${this.id}`, 2 * d, 2 * d);

      const { ctx, w, h } = this.#vismaskcache;

      const g = ctx.createRadialGradient(d, d, 0, d, d, d);

      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    return this.#vismaskcache;
  }

  /**
   * Return a string hash key representing the lamp.
   *
   * @returns The hash key.
   */
  protected getHashCache(): string {
    return [this.distance, this.diffuse].toString();
  }
}
