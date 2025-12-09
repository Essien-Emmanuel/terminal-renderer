// test.ts

import { Terminal } from "../utils/terminal.utils";
import { Canvas } from "../canvas/canvas";

// ANSI Color Codes for testing
// Foreground: 30=Black, 31=Red, 32=Green, 33=Yellow, 34=Blue, 37=White
// Background: 40=Black, 41=Red, 42=Green, 44=Blue, 47=White

const width = 40;
const height = 10;
const canvas = new Canvas(width, height);

const testString = "COLOR MANAGEMENT WORKS HERE!";

// --- 1. Setup ---
Terminal.clearScreen();
canvas.clear();

// --- 2. Drawing Logic: Different Colors for each Character ---
for (let i = 0; i < testString.length; i++) {
  const char = testString[i]!;

  // Position: (Column 5 + offset, Row 3)
  const x = 5 + i;
  const y = 3;

  // Cycle through colors
  const fgCode = (31 + (i % 4)).toString(); // Cycles through Red, Green, Yellow, Blue
  const bgCode = (44 + (i % 3)).toString(); // Cycles through Blue, Magenta, Cyan

  canvas.drawPixel(x, y, char, fgCode, bgCode);
}

// Draw a simple green line below
for (let x = 0; x < width; x++) {
  canvas.drawPixel(x, 7, "-", "32");
}

// --- 3. Render and Finalize ---
canvas.render();

// Show cursor after rendering is complete
Terminal.showCursor();
