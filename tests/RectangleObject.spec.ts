import RectangleObject from "../src/RectangleObject";
import Vec2 from "../src/Vec2";

const obj1 = new RectangleObject();

const ctx = document.createElement("canvas").getContext("2d");

it("should be instance", () => expect(obj1).toBeInstanceOf(RectangleObject));

it("should construct", () => {
  expect(obj1).toEqual({
    uniqueId: 0,
    diffuse: 0.8,
    points: [],
    topleft: new Vec2(),
    bottomright: new Vec2()
  });
});

it("should initialize points", () => expect(obj1.syncFromTopleftBottomright()).toBeUndefined());

it("should draw rectangle", () => {
  expect(obj1.fill(ctx)).toBeUndefined();
});
