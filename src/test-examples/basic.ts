import { Canvas } from "../canvas/canvas";
import { Terminal } from "../utils/terminal.utils";

Terminal.clearScreen();

const width = 80;
const height = 24;

const canvas = new Canvas(width, height);

canvas.clear();
for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    canvas.drawPixel(x, y, "#", "", "");
  }
}
canvas.render();
