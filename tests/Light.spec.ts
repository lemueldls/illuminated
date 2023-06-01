import { it, expect } from "vitest";

import Light from "../src/Light";
import Vec2 from "../src/Vec2";

const light = new Light();
const ctx = document.createElement("canvas").getContext("2d");

it("should be instance", () => expect(light).toBeInstanceOf(Light));

it("should construct", () =>
  expect(light).toEqual({ position: new Vec2(0, 0), distance: 100, diffuse: 0.8 }));

it("should render nothing", () => expect(light.render(ctx)).toBeUndefined());

it("should render mask", () => {
  expect(light.mask(ctx)).toBeUndefined();
  expect(light.mask(ctx)).toBeUndefined();
});

it("should calculate bounds", () =>
  expect(light.bounds()).toStrictEqual({
    topLeft: new Vec2(-100, -100),
    bottomRight: new Vec2(100, 100)
  }));

it("should get center", () => expect(light.center()).toStrictEqual(new Vec2(100, 100)));

it("should invoke with sample", () =>
  light.forEachSample((position) => expect(position).toStrictEqual(light.position)));
