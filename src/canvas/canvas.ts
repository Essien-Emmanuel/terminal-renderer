import process from "node:process";
import { checkInt } from "../utils/number.utils";
import { Terminal } from "../utils/terminal.utils";

interface Cell {
  char: string;
  fg?: string;
  bg?: string;
}

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

    const canvasSize = width * height;
    this.sketchBuffer = new Array(canvasSize).fill(this.EMPTY_CELL);
    this.displayBuffer = new Array(canvasSize).fill(this.EMPTY_CELL);

    Terminal.hideCursor();
  }

  private EMPTY_CELL = { char: " " };

  drawPixel(x: number, y: number, char: string, fg: string, bg: string) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      // y is line (row) and x is column (character pos)
      const index = y * this.width + x;
      this.sketchBuffer[index] = { char, fg, bg };
    }
  }

  render() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const index = y * this.width + x;

        const { char, fg, bg } = this.sketchBuffer[index] as Cell;

        // diffing
        if (char && char !== this.displayBuffer[index]?.char) {
          Terminal.moveTo(x, y);
          process.stdout.write(char);
          this.displayBuffer[index] = { char, fg, bg };
        }
      }
    }
    for (let i = 0; i < this.sketchBuffer.length; i++) {
      const sketchCell = this.sketchBuffer[i];
      const displayCell = this.displayBuffer[i];

      const charChange = sketchCell?.char !== displayCell?.char;
      const fgChange = sketchCell?.fg !== displayCell?.fg;
      const bgChange = sketchCell?.bg !== displayCell?.bg;

      if (charChange || fgChange || bgChange) {
      }
    }
  }

  clear() {
    for (let i = 0; i < this.sketchBuffer.length; i++) {
      this.sketchBuffer[i] = { ...this.EMPTY_CELL };
    }
  }
}

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

Terminal.showCursor();
