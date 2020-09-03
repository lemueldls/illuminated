import { Bounds } from "./types";
import { CanvasAndContext, createCanvasAnd2dContext } from "./utils";
import Vec2 from "./Vec2";

// eslint-disable-next-line no-use-before-define
export type LightOptions = Partial<Pick<Light, "position" | "distance" | "diffuse">>;

/**
 * Class for light objects.
 */
export default class Light {
  protected id!: number;

  /**
   * Position of this light. (0,0) by default.
   *
   * @default new Vec2();
   */
  public position = new Vec2();

  /**
   * Intensity of this light.
   *
   * @default 100;
   */
  public distance = 100;

  /**
   * How diffuse this light is.
   *
   * @default 0.8;
   */
  public diffuse = 0.8;

  public vismaskhash!: string;

  private vismaskcache!: CanvasAndContext;

  public samples!: number;

  /**
   * @param options - Options to be applied to this light.
   * @param options.position - Position of this light. (0,0) by default.
   * @param options.distance - Intensity of this light.
   * @param options.diffuse - How diffuse this light is.
   */
  public constructor(options: LightOptions = {}) {
    const { position, distance, diffuse } = options as LightOptions;

    this.position = position ?? this.position;
    this.distance = distance ?? this.distance;
    this.diffuse = diffuse ?? this.diffuse;
  }

  /**
   * Render the light onto the given context.
   *
   * @param _ctx - The canvas context onto which the light will be rendered.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  public render(_ctx: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.");
  }

  /**
   * Render a mask representing the visibility. (Used by {@linkcode DarkMask}.)
   *
   * @param ctx - The canvas context onto which the mask will be rendered.
   */
  public mask(ctx: CanvasRenderingContext2D): void {
    const c = this.getVisibleMaskCache();

    ctx.drawImage(
      c.canvas,
      Math.round(this.position.x - c.w / 2),
      Math.round(this.position.y - c.h / 2)
    );
  }

  /**
   * Calculate the boundaries of this light using the light's distance.
   *
   * @returns An anonymous object with the properties topleft and bottomright.
   * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
   */
  public bounds(): Bounds {
    return {
      topleft: new Vec2(this.position.x - this.distance, this.position.y - this.distance),
      bottomright: new Vec2(this.position.x + this.distance, this.position.y + this.distance)
    };
  }

  /**
   * Return the center of this light.
   * i.e. The position where the light intensity is the highest.
   *
   * @returns A new vector that represents the center of this light.
   */
  public center(): Vec2 {
    return new Vec2(this.distance, this.distance);
  }

  /**
   * Invoke a function for every sample generated by this light.
   *
   * @remarks
   * Implement it by spreading samples and calling f at each time.
   *
   * @param f - Function to be called for every sample.
   * The function will be passed a vector representing the position of the sample.
   */
  public forEachSample(f: (position: Vec2) => void): void {
    f(this.position);
  }

  /**
   * Creates a canvas context with the visible mask rendered onto it.
   *
   * @returns A canvas context with the visible mask rendered onto it.
   */
  protected getVisibleMaskCache(): CanvasAndContext {
    // By default use a radial gradient based on the distance
    const d = Math.floor(this.distance * 1.4);
    const hash = `${d}`;

    if (this.vismaskhash !== hash) {
      this.vismaskhash = hash;
      this.vismaskcache = createCanvasAnd2dContext(`vm${this.id}`, 2 * d, 2 * d);

      const c = this.vismaskcache;
      const g = c.ctx.createRadialGradient(d, d, 0, d, d, d);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      c.ctx.fillStyle = g;
      c.ctx.fillRect(0, 0, c.w, c.h);
    }

    return this.vismaskcache;
  }

  /**
   * Return a string hash key representing this lamp.
   *
   * @returns The hash key.
   */
  protected getHashCache(): string {
    return [this.distance, this.diffuse].toString();
  }
}
