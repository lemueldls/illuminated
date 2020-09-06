import DarkMask from "../src/DarkMask";
import Light from "../src/Light";

const light = new Light();
const m1 = new DarkMask();
const m2 = new DarkMask({
  lights: [light]
});

it("should be instance", () => expect(m1).toBeInstanceOf(DarkMask));

it("should construct", () => {
  expect(m1).toEqual({ lights: [], color: "rgba(0,0,0,0.9)" });
  expect(m2).toEqual({ lights: [light], color: "rgba(0,0,0,0.9)" });
});

it("should compute", () => {
  expect(m1.compute(800, 600)).toBeUndefined();
  expect(m1.compute(800, 600)).toBeUndefined();
  expect(m2.compute(800, 600)).toBeUndefined();
});

it("should render", () =>
  expect(m1.render(document.createElement("canvas").getContext("2d"))).toBeUndefined());

it("should get canvas", () => expect(m1.getCanvas()).toBeInstanceOf(HTMLCanvasElement));
