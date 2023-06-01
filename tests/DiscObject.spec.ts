import { it, expect } from "vitest";

import DiscObject from "../src/DiscObject";
import Vec2 from "../src/Vec2";

const obj = new DiscObject();
const ctx = document.createElement("canvas").getContext("2d");

it("should be instance", () => expect(obj).toBeInstanceOf(DiscObject));

it("should construct", () =>
  expect(obj).toEqual({
    diffuse: 0.8,
    center: new Vec2(0, 0),
    radius: 20
  }));

it("should cast shadow", () => expect(obj.cast(ctx, new Vec2(), obj.bounds())).toBeUndefined());

it("should draw path", () => expect(obj.path(ctx)).toBeUndefined());

it("should calculate bounds", () =>
  expect(obj.bounds()).toStrictEqual({
    topLeft: new Vec2(-20, -20),
    bottomRight: new Vec2(20, 20)
  }));

it("should contain point", () => expect(obj.contains(new Vec2())).toBe(true));
