import Vec2 from "./Vec2";

/**
 * Boundaries with the properties `topleft` and `bottomright`.
 * The property values are [[`Vec2`]] objects representing the corners of the boundary.
 *
 * @typedef {Object} Bounds
 * @property {Vec2} topleft
 * @property {Vec2} bottomright
 */
export interface Bounds {
  topleft: Vec2;
  bottomright: Vec2;
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
 * @param {string} id - ID name of the canvas context.
 * @param {number} width - Width of the canvas context.
 * @param {number} height - Height of the canvas context.
 * @return {CanvasAndContext} An anonymous object with {@linkcode CanvasAndContext.canvas canvas},
 * {@linkcode CanvasAndContext.ctx ctx}, {@linkcode CanvasAndContext.w w} and
 * {@linkcode CanvasAndContext.h h} properties.
 */
export function createCanvasAnd2dContext(
  id: string,
  width: number,
  height: number
): CanvasAndContext {
  const iid = `illujs_${id}`;
  let canvas = document.getElementById(iid) as HTMLCanvasElement;

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = iid;
    canvas.width = width;
    canvas.height = height;
    canvas.style.display = "none";
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvas.width = width;
  canvas.height = height;

  return { canvas, ctx, w: width, h: height };
}

/**
 * Draw a path defined by the given points onto the given ctx.
 *
 * @param {CanvasRenderingContext2D} ctx - The context onto which the properties should be drawn.
 * @param {Vec2[]} points - An array of {@linkcode Vec2} objects that define the path.
 * @param {boolean} [dontJoinLast] - True if the last point should joined with the
 * first point in the path.
 */
export function path(ctx: CanvasRenderingContext2D, points: Vec2[], dontJoinLast?: boolean): void {
  let p = points[0];
  if (!p) throw new Error("There are no points to draw a path of.");

  ctx.moveTo(p.x, p.y);

  for (let i = 1, l = points.length; i < l; ++i) {
    p = points[i];
    ctx.lineTo(p.x, p.y);
  }

  if (!dontJoinLast && points.length > 2) {
    [p] = points;
    ctx.lineTo(p.x, p.y);
  }
}

/**
 * Converts a CSS color string into RGBA format.
 *
 * @param {string} color - Color in any CSS format.
 * @param {number} [alpha=1] - Alpha value for produced color.
 * @return {string} Color in RGBA format.
 */
export const getRGBA = (() => {
  // var ctx = createCanvasAnd2dContext("grgba", 1, 1);
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  return (color: string, alpha = 1) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);

    const [red, green, blue] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgba(${[red, green, blue, alpha]})`;
  };
})();

/**
 * Converts a CSS color string into an anonymous object with color and alpha properties.
 *
 * @param {string} color - Color in any CSS format.
 * @return {{color: string, alpha: number}} An anonymous object with the
 * properties color and alpha. The color property is a string in hex format and
 * the alpha property is a number from 0.0 to 1.0, rounded to 3 decimal places.
 */
export const extractColorAndAlpha: (
  color: string
) => {
  color: string;
  alpha: number;
} = (() => {
  // const ctx = createCanvasAnd2dContext("grgba", 1, 1);
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  /**
   * @param {number} value
   * @return {string}
   */
  function toHex(value: number) {
    let s = value.toString(16);
    if (s.length === 1) s = `0${s}`;
    return s;
  }

  return (color: string) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);

    const [red, green, blue, alpha] = ctx.getImageData(0, 0, 1, 1).data;
    return {
      color: `#${toHex(red)}${toHex(green)}${toHex(blue)}`,
      alpha: Math.round((1000 * alpha) / 255) / 1000
    };
  };
})();

/**
 * Get tangents from (0, 0) to circle of radius with given center, for {@linkcode DiscObject.cast}.
 *
 * @param {number} radius
 * @param {(Vec2|number)} center
 * @param {number} pointY
 * @return {Vec2[]}
 */
export function getTan2(radius: number, center: Vec2 | number, pointY?: number): Vec2[] {
  const epsilon = 1e-6; // getTan2.epsilon

  let x0;
  let y0;
  let len2;
  let soln;

  const solutions = [];
  const a = radius;

  // if (typeof a === "object" && typeof center === "number") {
  //   const tmp = a;
  //   center = a;
  //   center = tmp; // swap
  // }
  if (typeof center === "number") {
    // getTan2(radius:number, x0:number, y0:number)
    x0 = center;
    y0 = pointY || 0;
    len2 = x0 * x0 + y0 * y0;
  } else {
    // getTans2(radius:number, center:object={x:x0,y:y0})
    x0 = center.x;
    y0 = center.y;
    len2 = center.length2();
  }

  // t = +/- Math.acos( (-a*x0 +/- y0 * Math.sqrt(x0*x0 + y0*y0 - a*a))/(x0*x0 + y0*y) );
  const len2a = y0 * Math.sqrt(len2 - a * a);
  const tt = Math.acos((-a * x0 + len2a) / len2);
  const nt = Math.acos((-a * x0 - len2a) / len2);
  const ttCos = a * Math.cos(tt);
  const ttSin = a * Math.sin(tt);
  const ntCos = a * Math.cos(nt);
  const ntSin = a * Math.sin(nt);

  // Note: cos(-t) == cos(t) and sin(-t) == -sin(t) for all t, so find
  // x0 + a*cos(t), y0 +/- a*sin(t)
  // Solutions have equal lengths
  soln = new Vec2(x0 + ntCos, y0 + ntSin);
  solutions.push(soln);
  const dist0 = soln.length2();

  soln = new Vec2(x0 + ttCos, y0 - ttSin);
  solutions.push(soln);
  const dist1 = soln.length2();

  // console.log(`N${1}):`, dist0, dist1);

  if (Math.abs(dist0 - dist1) < epsilon) return solutions;

  soln = new Vec2(x0 + ntCos, y0 - ntSin);
  solutions.push(soln);
  const dist2 = soln.length2();

  // console.log(`N${2}):`, dist2);

  // Changed order so no strange X of light inside the circle. Could also sort results.
  if (Math.abs(dist1 - dist2) < epsilon) return [soln, solutions[1]];
  if (Math.abs(dist0 - dist2) < epsilon) return [solutions[0], soln];
  soln = new Vec2(x0 + ttCos, y0 + ttSin);
  solutions.push(soln);
  const dist3 = soln.length2();

  // console.log(`N${3}):`, dist3);

  if (Math.abs(dist2 - dist3) < epsilon) return [solutions[2], soln];
  if (Math.abs(dist1 - dist3) < epsilon) return [solutions[1], soln];
  if (Math.abs(dist0 - dist3) < epsilon) return [solutions[0], soln];
  // return all 4 solutions if no matching vector lengths found.
  return solutions;
}
