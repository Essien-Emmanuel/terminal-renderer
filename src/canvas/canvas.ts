import process from "node:process";
import { checkInt } from "../utils/number.utils";
import { Terminal } from "../utils/terminal.utils";
import { Cell } from "../cell/cell";

export class Canvas {
  public width: number;
  public height: number;
  public sketchBuffer: Cell[];
  public displayBuffer: Cell[];

  constructor(width: number, height: number) {
    checkInt(width, "width");
    checkInt(height, "height");

    this.width = width || 80;
    this.height = height || 24;

    this.sketchBuffer = new Array(width * height).fill(new Cell(" ", ""));
    this.displayBuffer = new Array(width * height).fill(new Cell(" ", ""));

    Terminal.hideCursor();
  }

  drawPixel(x: number, y: number, char: string, color: string) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      // y is line (row) and x is column (character pos)
      const index = y * this.width + x;
      this.sketchBuffer[index] = { char, color };
    }
  }

  render() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const index = y * this.width + x;

        const { char, color } = this.sketchBuffer[index] as Cell;

        // diffing
        if (char && char !== this.displayBuffer[index]?.char) {
          Terminal.moveTo(x, y);
          process.stdout.write(char);
          this.displayBuffer[index] = { char, color };
        }
      }
    }
  }

  clear() {
    this.sketchBuffer.fill(new Cell(" ", ""));
  }
}

Terminal.clearScreen();

const width = 80;
const height = 24;

const canvas = new Canvas(width, height);

canvas.clear();
for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    canvas.drawPixel(x, y, "#", "");
  }
}
canvas.render();

Terminal.showCursor();
