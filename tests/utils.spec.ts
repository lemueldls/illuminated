import {
  createCanvasAnd2dContext,
  extractColorAndAlpha,
  getRGBA,
  getTan2,
  path
} from "../src/utils";
import Vec2 from "../src/Vec2";

describe("Create canvas and context", () => {
  it("should create with valid canvas", () => {
    const { canvas, ctx, w, h } = createCanvasAnd2dContext("test", 800, 600);

    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(ctx.canvas).toBeInstanceOf(HTMLCanvasElement);

    expect(w).not.toBeNaN();
    expect(h).not.toBeNaN();
  });
  it("should create with invalid canvas", () => {
    const c = document.createElement("canvas");
    c.id = "illujs_else";
    document.body.appendChild(c);

    const { canvas, ctx, w, h } = createCanvasAnd2dContext("else", 800, 600);

    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(ctx.canvas).toBeInstanceOf(HTMLCanvasElement);

    expect(w).not.toBeNaN();
    expect(h).not.toBeNaN();
  });
});

describe("Draw a path", () => {
  const vectors = [new Vec2(2, 4), new Vec2(6, 3), new Vec2(8, 2)];
  const ctx = document.createElement("canvas").getContext("2d");

  it("should throw error", () => expect(() => path(ctx, [])).toThrowError());
  it("should draw open", () => path(ctx, vectors, false));
  it("should draw closed", () => path(ctx, vectors, true));
});

it("should convert color to RGBA", () => {
  expect(getRGBA("crimson", 1)).toBe("rgba(220,20,60,1)");
  expect(getRGBA("dodgerblue")).toBe("rgba(30,144,255,1)");
});

it("should convert color to hex object", () =>
  expect(extractColorAndAlpha("teal")).toStrictEqual({ color: "#008080", alpha: 1 }));

it("should get tangents", () => {
  // for (let i = 0; i < 5; i += 0.1)
  //   for (let j = 0; j < 5; j += 0.1) for (let k = 0; k < 5; k += 0.1) getTan2(i, j, k);
  getTan2(0, 0);
  getTan2(6, new Vec2(9, 3));
  getTan2(-25, -25, -25);
  getTan2(-24.9, new Vec2(-25, -25));
  getTan2(-25, new Vec2(-25, 0.10000000000008635));
  getTan2(-25, -24.9, 2.3000000000000873);
  // TODO
});
