export class Cell {
  public char: string;
  public fg: string;
  public bg: string;

  constructor(char: string, fg: string, bg: string) {
    this.char = char;
    this.fg = fg;
    this.bg = bg;
  }
}
