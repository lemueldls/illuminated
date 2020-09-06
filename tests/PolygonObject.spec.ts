import PolygonObject from "../src/PolygonObject";
import Vec2 from "../src/Vec2";

const obj1 = new PolygonObject();
const obj2 = new PolygonObject({
  points: [new Vec2(3, 7), new Vec2(10, 5), new Vec2(-5, -8), new Vec2(6, 2), new Vec2(-1, 9)]
});
const obj3 = new PolygonObject({
  points: obj2.points.map((v) => v.mul(-0.5))
});
const obj4 = new PolygonObject({
  points: obj3.points.map((v) => v.inv())
});

const ctx = document.createElement("canvas").getContext("2d");

it("should be instance", () => {
  expect(obj1).toBeInstanceOf(PolygonObject);
  expect(obj2).toBeInstanceOf(PolygonObject);
  expect(obj3).toBeInstanceOf(PolygonObject);
});

it("should construct", () => {
  expect(obj1).toEqual({ uniqueId: 0, diffuse: 0.8, points: [] });
  expect(obj2).toEqual({
    uniqueId: 0,
    diffuse: 0.8,
    points: [new Vec2(3, 7), new Vec2(10, 5), new Vec2(-5, -8), new Vec2(6, 2), new Vec2(-1, 9)]
  });
  expect(obj3).toEqual({
    uniqueId: 0,
    diffuse: 0.8,
    points: [
      new Vec2(-1.5, -3.5),
      new Vec2(-5, -2.5),
      new Vec2(2.5, 4),
      new Vec2(-3, -1),
      new Vec2(0.5, -4.5)
    ]
  });
  expect(obj4).toEqual({
    uniqueId: 0,
    diffuse: 0.8,
    points: [
      new Vec2(1.5, 3.5),
      new Vec2(5, 2.5),
      new Vec2(-2.5, -4),
      new Vec2(3, 1),
      new Vec2(-0.5, 4.5)
    ]
  });
});

it("should calculate bounds", () => {
  expect(() => obj1.bounds()).toThrowError();
  expect(obj2.bounds()).toStrictEqual({ topleft: new Vec2(-5, -8), bottomright: new Vec2(10, 9) });
});

it("should not contain point", () => {
  expect(obj1.contains(new Vec2())).toBe(false);
  expect(obj2.contains(new Vec2())).toBe(false);
  expect(obj3.contains(new Vec2())).toBe(false);
  expect(obj4.contains(new Vec2())).toBe(false);
});

it("should draw path", () => {
  expect(() => obj1.path(ctx)).toThrowError();
  expect(obj2.path(ctx)).toBeUndefined();
  expect(obj3.path(ctx)).toBeUndefined();
  expect(obj4.path(ctx)).toBeUndefined();
});

it("should cast shadows", () => {
  expect(() => obj1.cast(ctx, new Vec2(), obj1.bounds())).toThrowError();

  obj2.cast(ctx, new Vec2(), obj2.bounds());
  obj3.cast(ctx, new Vec2(), obj2.bounds());
  obj4.cast(ctx, new Vec2(), obj2.bounds());

  obj3.cast(ctx, new Vec2(), obj3.bounds());
  obj4.cast(ctx, new Vec2(), obj4.bounds());
});
