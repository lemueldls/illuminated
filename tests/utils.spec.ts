import {
  createCanvasAnd2dContext,
  path,
  getRGBA,
  extractColorAndAlpha,
  getTan2
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

  it("should draw open", () => path(ctx, vectors, false));
  it("should draw closed", () => path(ctx, vectors, true));
});

it("should convert color to RGBA", () => expect(getRGBA("crimson", 1)).toBe("rgba(220,20,60,1)"));

it("should convert color to hex object", () =>
  expect(extractColorAndAlpha("teal")).toStrictEqual({ color: "#008080", alpha: 1 }));

it("should get tangents", () => {
  const r1 = [
    new Vec2(3.9303061543300926, 6.20908153700972),
    new Vec2(6.869693845669907, -2.60908153700972)
  ];
  const NaNs = [new Vec2(NaN, NaN), new Vec2(NaN, NaN), new Vec2(NaN, NaN), new Vec2(NaN, NaN)];

  expect(getTan2(6, new Vec2(9, 3))).toStrictEqual(r1);
  expect(getTan2(6, 9, 3)).toStrictEqual(r1);

  expect(getTan2(9, 6, 3)).toStrictEqual(NaNs);
  expect(getTan2(2, 0, 5)).toStrictEqual([
    new Vec2(-1.8330302779823358, 4.199999999999999),
    new Vec2(1.8330302779823358, 4.199999999999999)
  ]);
  expect(getTan2(2, 0)).toStrictEqual(NaNs);

  // TODO
});
