import OpaqueObject from "../src/OpaqueObject";
import Vec2 from "../src/Vec2";

const obj = new OpaqueObject();
const ctx = document.createElement("canvas").getContext("2d");

it("should be instance", () => expect(obj).toBeInstanceOf(OpaqueObject));

it("should construct", () => expect(obj).toEqual({ diffuse: 0.8, uniqueId: 0 }));

it("should calculate bounds", () =>
  expect(obj.bounds()).toStrictEqual({
    topleft: new Vec2(0, 0),
    bottomright: new Vec2(0, 0)
  }));

it("should cast no shadow", () => expect(obj.cast(ctx, new Vec2(), obj.bounds())).toBeUndefined());

it("should path nothing", () => expect(obj.path(ctx)).toBeUndefined());

it("should contain none", () => expect(obj.contains(new Vec2())).toBe(false));
