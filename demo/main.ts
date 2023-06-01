import { Vec2, Lamp } from "../src/illuminated";

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

const lamp = new Lamp({
  position: new Vec2(250, 250),
  distance: 250
});

const lamp2 = new Lamp({
  position: new Vec2(350, 350),
  distance: 100
});

let time = 0;

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  lamp.render(ctx);
  lamp2.render(ctx);

  lamp.distance += Math.sin(time / 10) * 2;
  lamp2.distance += Math.sin(time / 50) * 3;

  requestAnimationFrame(render);
  time++;
}

render();
