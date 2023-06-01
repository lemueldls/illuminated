import { it, expect } from "vitest";

import RectangleObject from "../src/RectangleObject";
import Vec2 from "../src/Vec2";

const obj1 = new RectangleObject();

const ctx = document.createElement("canvas").getContext("2d");

it("should be instance", () => expect(obj1).toBeInstanceOf(RectangleObject));

it("should construct", () => {
  expect(obj1).toEqual({
    diffuse: 0.8,
    points: [new Vec2(), new Vec2(), new Vec2(), new Vec2()],
    topLeft: new Vec2(),
    bottomRight: new Vec2()
  });
});

it("should draw rectangle", () => {
  expect(obj1.fill(ctx)).toBeUndefined();
});
