import process from "node:process";

export class Canvas {
  public width: number;
  public height: number;
  public sketchBuffer: string[];
  public displayBuffer: string[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.sketchBuffer = new Array(width * height).fill(" ");
    this.displayBuffer = new Array(width * height).fill(" ");

    this.hideCursor();
  }

  drawPixel(x: number, y: number, char: string) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      const index = y * this.width + x;
      this.sketchBuffer[index] = char;
    }
  }

  render() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const index = y * this.width + x;
        const char = this.sketchBuffer[index];

        if (char && char !== this.displayBuffer[index]) {
          this.displayBuffer[index] = char;
        }
      }
    }
  }

  hideCursor() {
    process.stdout.write("\x1b[?25l");
  }
}
