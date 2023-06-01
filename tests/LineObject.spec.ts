import { it, expect } from "vitest";

import LineObject from "../src/LineObject";
import Vec2 from "../src/Vec2";

const obj = new LineObject();

it("should be instance", () => expect(obj).toBeInstanceOf(LineObject));

it("should construct", () =>
  expect(obj).toEqual({
    a: new Vec2(),
    b: new Vec2(),
    diffuse: 0.8,
    points: [new Vec2(), new Vec2()]
  }));
