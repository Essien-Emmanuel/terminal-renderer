export class Terminal {
  static moveTo(x: number, y: number) {
    process.stdout.write(`\x1b[${y + 1};${x + 1}H`);
  }

  static hideCursor() {
    process.stdout.write("\x1b[?25l");
  }

  static showCursor() {
    process.stdout.write("\x1b[?25h");
  }

  static clearScreen() {
    process.stdout.write("\x1b[2J");
  }
}
