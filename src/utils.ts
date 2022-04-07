import Vec2 from "./Vec2";

/**
 * Boundaries with the properties `topLeft` and `bottomRight`.
 * The property values are {@linkcode Vec2} objects representing the corners of the boundary.
 */
export interface Bounds {
  topLeft: Vec2;
  bottomRight: Vec2;
}

export interface CanvasAndContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
}

/**
 * Creates a canvas and context with the given width and height.
 *
 * @param id - ID name of the canvas context.
 * @param width - Width of the canvas context.
 * @param height - Height of the canvas context.
 * @returns An anonymous object with {@linkcode CanvasAndContext.canvas canvas},
 * {@linkcode CanvasAndContext.ctx ctx}, {@linkcode CanvasAndContext.w w} and
 * {@linkcode CanvasAndContext.h h} properties.
 */
export function createCanvasAnd2dContext(
  id: string,
  width: number,
  height: number
): CanvasAndContext {
  const iid = `illuminated-${id}`;
  let canvas = document.querySelector<HTMLCanvasElement>(`#${iid}`);

  if (!canvas) {
    canvas = document.createElement("canvas");

    canvas.id = iid;
    canvas.width = width;
    canvas.height = height;
    canvas.style.display = "none";

    document.body.append(canvas);
  }

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.clearRect(0, 0, canvas.width, canvas.height);

  canvas.width = width;
  canvas.height = height;

  return { canvas, ctx: context, w: width, h: height };
}

/**
 * Draw a path defined by the given points onto the given ctx.
 *
 * @param context - The context onto which the properties should be drawn.
 * @param points - An array of {@linkcode Vec2} objects that define the path.
 * @param dontJoinLast - If the last point should joined with the first point in the path.
 */
export function path(
  context: CanvasRenderingContext2D,
  points: Vec2[],
  dontJoinLast?: boolean
): void {
  let [point] = points as [Vec2 | undefined];
  if (!point) throw new Error("There are no points to draw a path of.");

  context.moveTo(point.x, point.y);

  for (let index = 1, l = points.length; index < l; ++index) {
    point = points[index];
    context.lineTo(point.x, point.y);
  }

  if (!dontJoinLast && points.length > 2) {
    [point] = points;
    context.lineTo(point.x, point.y);
  }
}

/**
 * Converts a CSS color string into RGBA format.
 *
 * @param color - Color in any CSS format.
 * @param alpha - Alpha value for produced color.
 * @returns Color in RGBA format.
 */
export const getRGBA = (() => {
  const canvas = document.createElement("canvas");

  canvas.width = 1;
  canvas.height = 1;

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  return (color: string, alpha = 1) => {
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);

    const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;

    return `rgba(${[red, green, blue, alpha]})`;
  };
})();

/**
 * Converts a CSS color string into an anonymous object with color and alpha properties.
 *
 * @param color - Color in any CSS format.
 * @returns} An anonymous object with the
 * properties color and alpha. The color property is a string in hex format and
 * the alpha property is a number from 0.0 to 1.0, rounded to 3 decimal places.
 */
export const extractColorAndAlpha: (color: string) => {
  color: string;
  alpha: number;
} = (() => {
  const canvas = document.createElement("canvas");

  canvas.width = 1;
  canvas.height = 1;

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  /**
   * @param value
   */
  function toHex(value: number) {
    let s = value.toString(16);
    if (s.length === 1) s = `0${s}`;

    return s;
  }

  return (color: string) => {
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);

    const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;

    return {
      color: `#${toHex(red)}${toHex(green)}${toHex(blue)}`,
      alpha: Math.round((1000 * alpha) / 255) / 1000
    };
  };
})();

/**
 * Get tangents from (0, 0) to circle of radius with given center, for {@linkcode DiscObject.cast}.
 *
 * @param radius
 * @param center
 * @param pointY
 */
export function getTan2(radius: number, center: Vec2 | number, pointY?: number): Vec2[] {
  const epsilon = 1e-6; // getTan2.epsilon

  let x0;
  let y0;
  let length2;
  let soln;

  const solutions = [];

  if (typeof center === "number") {
    x0 = center;
    y0 = pointY || 0;
    length2 = x0 * x0 + y0 * y0;
  } else {
    x0 = center.x;
    y0 = center.y;
    length2 = center.length2();
  }

  // t = +/- Math.acos((-a * x0 +/- y0 * Math.sqrt(x0 * x0 + y0 * y0 - a * a)) / (x0 * x0 + y0 * y));

  const length2a = y0 * Math.sqrt(length2 - radius * radius);

  const tt = Math.acos((-radius * x0 + length2a) / length2);
  const nt = Math.acos((-radius * x0 - length2a) / length2);

  const ttCos = radius * Math.cos(tt);
  const ttSin = radius * Math.sin(tt);
  const ntCos = radius * Math.cos(nt);
  const ntSin = radius * Math.sin(nt);

  // NOTE: cos(-t) == cos(t) and sin(-t) == -sin(t) for all t, so find
  // x0 + a*cos(t), y0 +/- a*sin(t)
  // Solutions have equal lengths
  soln = new Vec2(x0 + ntCos, y0 + ntSin);
  solutions.push(soln);
  const distance0 = soln.length2();

  soln = new Vec2(x0 + ttCos, y0 - ttSin);
  solutions.push(soln);
  const distance1 = soln.length2();

  if (Math.abs(distance0 - distance1) < epsilon) return solutions;

  soln = new Vec2(x0 + ntCos, y0 - ntSin);
  solutions.push(soln);
  const distance2 = soln.length2();

  // Changed order so no strange X of light inside the circle. Could also sort results.
  if (Math.abs(distance1 - distance2) < epsilon) return [soln, solutions[1]];
  if (Math.abs(distance0 - distance2) < epsilon) return [solutions[0], soln];

  soln = new Vec2(x0 + ttCos, y0 + ttSin);
  solutions.push(soln);

  const distance3 = soln.length2();

  if (Math.abs(distance2 - distance3) < epsilon) return [solutions[2], soln];
  if (Math.abs(distance1 - distance3) < epsilon) return [solutions[1], soln];
  if (Math.abs(distance0 - distance3) < epsilon) return [solutions[0], soln];

  // Return all 4 solutions if no matching vector lengths found.
  return solutions;
}
