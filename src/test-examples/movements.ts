import type { Canvas } from "../canvas/canvas";

export function moveSideways(canvas: Canvas, width: number) {
  let x = 0;
  let y = 10;
  let dx = 1;

  setInterval(() => {
    // 1. Clear "logic" (fill backbuffer with space)
    canvas.clear();

    // 2. Update Physics
    x += dx;
    if (x >= width - 1 || x <= 0) dx *= -1; // flip movement to the opposite side

    // 3. Draw Graphics
    canvas.drawPixel(x, y, "O", "", "");
    canvas.drawPixel(x - dx, y, "-", "", ""); // trail

    // 4. Render to screen
    canvas.render();
  }, 50); // 20 FPS
}
