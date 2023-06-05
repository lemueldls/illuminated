import { it, expect } from "vitest";

import Lamp from "../src/Lamp";
import Vec2 from "../src/Vec2";

const l1 = new Lamp({ id: 1 });
const l2 = new Lamp({ id: 2 });

const ctx = document.createElement("canvas").getContext("2d");

it("should be instance", () => expect(l1).toBeInstanceOf(Lamp));

it("should construct", () =>
  expect(l1).toEqual({
    position: new Vec2(),
    distance: 100,
    diffuse: 0.8,
    id: 1,
    samples: 1,
    color: "rgba(250,220,150,0.8)",
    radius: 0,
    angle: 0,
    roughness: 0,
    hidden: false
  }));

it("should get center", () => expect(l1.center()).toStrictEqual(new Vec2(100, 100)));

it("should calculate bounds", () =>
  expect(l1.bounds()).toStrictEqual({
    topLeft: new Vec2(-100, -100),
    bottomRight: new Vec2(100, 100)
  }));

it("should render mask", () => expect(l1.mask(ctx)).toBeUndefined());

it("should render lamp", () => {
  expect(l1.render(ctx)).toBeUndefined();
  expect(l1.render(ctx)).toBeUndefined();

  expect(l2.render(ctx)).toBeUndefined();
  expect(l2.render(ctx)).toBeUndefined();
});

it("should invoke with sample", () =>
  l1.forEachSample((position) => expect(position).toStrictEqual(l1.position)));
