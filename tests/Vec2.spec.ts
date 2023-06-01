import { it, expect } from "vitest";

import Vec2 from "../src/Vec2";

const v1 = new Vec2(2, 5);
const v2 = new Vec2(6, 4);

it("should be instance", () => expect(v1).toBeInstanceOf(Vec2));

it("should construct", () => expect(v1).toEqual({ x: 2, y: 5 }));

it("should match copy", () => expect(v1.copy()).toStrictEqual(v1));

it("should calculate dot product", () =>
  expect(v1.dot(v2)).toBe(v1.x * v2.x + v1.y * v2.y + 0 * 0));

it("should subtract vectors", () =>
  expect(v1.sub(v2)).toStrictEqual(new Vec2(v1.x - v2.x, v1.y - v2.y)));

it("should add vectors", () =>
  expect(v1.add(v2)).toStrictEqual(new Vec2(v1.x + v2.x, v1.y + v2.y)));

it("should multiply vector", () => expect(v1.mul(3)).toStrictEqual(new Vec2(v1.x * 3, v1.y * 3)));

it("should inverse vector", () => expect(v1.inv()).toStrictEqual(new Vec2(v1.x * -1, v1.y * -1)));

it("should calculate squared distance", () =>
  expect(v1.dist2(v2)).toBe((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2));

it("should normalize the vector", () => {
  const length = Math.sqrt(v1.x ** 2 + v1.y ** 2);

  expect(v1.normalize()).toStrictEqual(new Vec2(v1.x / length, v1.y / length));
});

it("should calculate squared length", () =>
  expect(v1.length2()).toStrictEqual(v1.x ** 2 + v1.y ** 2));

it("should return string representing vector", () => expect(v1.toString()).toBe(`${v1.x},${v1.y}`));

it("should be out of bounds", () => expect(v1.inBound(v2.inv(), v2)).toBeFalsy());
