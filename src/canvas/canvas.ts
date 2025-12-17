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

  drawPixel(x: number, y: number, char: string, fg?: string, bg?: string) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      // y is line (row) and x is column (character pos)
      const index = y * this.width + x;
      this.sketchBuffer[index] = { char, fg, bg };
    }
  }

  // horizontal walker. handles low octants
  drawLineH(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    char: string,
    fg?: string,
    bg?: string
  ) {
    let dx = x1 - x0;
    let dy = y1 - y0;
    let yi = 1;

    if (dy < 0) {
      yi = -1;
      dy = -dy;
    }

    let decision = 2 * dy - dx;
    let y = y0;

    for (let x = x0; x < x1; x++) {
      this.drawPixel(x, y, char, fg, bg);
      if (decision > 0) {
        y = y + yi;
        decision = decision + 2 * (dy - dx);
      } else {
        decision = decision + 2 * dy;
      }
    }
  }

  drawLineV(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    char: string,
    fg?: string,
    bg?: string
  ) {
    let dy = y1 - y0;
    let dx = x1 - x0;
    let xi = 1;
    let yi = 1;

    if (dx < 0) {
      dx = -dx;
      xi = -1;
    }

    if (dy < 0) {
      dy = -dy;
      yi = -1;
    }

    let decision = 2 * dx - dy;
    let x = x0;

    for (let y = y0; y < y1; y += yi) {
      this.drawPixel(x, y, char, fg, bg);

      if (decision > 0) {
        x = x + xi;
        decision = decision + 2 * (dx - dy);
      } else {
        decision = decision + 2 * dx;
      }
    }
  }

  drawLine(
    x0: number,
    x1: number,
    y0: number,
    y1: number,
    char: string,
    fg?: string,
    bg?: string
  ) {
    const dy = y1 - y0;
    const dx = x1 - x0;
    const isHorizontalAxis = Math.abs(dy) < Math.abs(dx); // major axis

    if (isHorizontalAxis) {
      if (x0 > x1) {
        this.drawLineH(x1, y1, x0, y0, char, fg, bg);
      } else {
        this.drawLineH(x0, y0, x1, y1, char, fg, bg);
      }
    } else {
      if (y0 > y1) {
        this.drawLineV(x1, y1, x0, y0, char, fg, bg);
      } else {
        this.drawLineV(x0, y0, x1, y1, char, fg, bg);
      }
    }
  }

  render() {
    for (let i = 0; i < this.sketchBuffer.length; i++) {
      const sketchCell = this.sketchBuffer[i];
      const displayCell = this.displayBuffer[i];

      const charChange = sketchCell?.char !== displayCell?.char;
      const fgChange = sketchCell?.fg !== displayCell?.fg;
      const bgChange = sketchCell?.bg !== displayCell?.bg;

      if (charChange || fgChange || bgChange) {
        const y = Math.floor(i / this.width);
        const x = i % this.width;

        Terminal.moveTo(x, y);

        let output = "";

        if (sketchCell && (sketchCell.fg || sketchCell.bg)) {
          output += this.getAnsiCodes(sketchCell);
        }

        output += sketchCell?.char;

        if (sketchCell && (sketchCell.fg || sketchCell.bg)) {
          output += this.ANSI_RESET_CODE;
        }

        process.stdout.write(output);

        if (sketchCell) {
          this.displayBuffer[i] = { ...sketchCell };
        }
      }
    }
  }

  public ANSI_RESET_CODE = "\x1b[0m";

  private getAnsiCodes(cell: Cell) {
    const codes: string[] = [];

    if (cell.fg) codes.push(cell.fg);
    if (cell.bg) codes.push(cell.bg);

    if (codes.length === 0) {
      return "";
    }

    return `\x1b[${codes.join(";")}m`;
  }

  clear() {
    for (let i = 0; i < this.sketchBuffer.length; i++) {
      this.sketchBuffer[i] = { ...this.EMPTY_CELL };
    }
  }
}

Terminal.showCursor();
