/**
 * Generates a keyboard geometry configuration file for the Glove80 layout
 * @param {number} row_offset - How far the R1C6, R1C5 keys are offset from R1C4, R1C3, R1C2, R1C1 (default 0.5)
 * @param {number} halves_offset - How far apart the left hand side is from the right hand side (default 2)
 * @returns {string} The generated TypeScript/JavaScript code as a string
 */
function generateKeyboardGeometry(row_offset = 0.5, halves_offset = 2) {
  // Calculate the starting X position for the right hand
  const rightHandStartX = 6 + halves_offset;

  let output = `import { type GeometryDict } from "../types.ts";\n\n`;
  output += `export const MATRIX: GeometryDict = {\n`;

  // Generate Left Hand Keys
  // ----------------------

  // Define the left hand rows and columns structure
  const leftHandStructure = {
    1: { cols: [6, 5, 4, 3, 2] },
    2: { cols: [6, 5, 4, 3, 2, 1] },
    3: { cols: [6, 5, 4, 3, 2, 1] },
    4: { cols: [6, 5, 4, 3, 2, 1] },
    5: { cols: [6, 5, 4, 3, 2, 1] },
    6: { cols: [6, 5, 4, 3, 2] },
  };

  // Generate left hand keys
  for (let row = 1; row <= 6; row++) {
    output += `  // Left hand Row ${row}\n`;

    const structure = leftHandStructure[row];

    for (const col of structure.cols) {
      const x = 6 - col;
      let y = row - 1;

      // Apply row offset to columns 5 and 6
      if (col >= 5) {
        y += row_offset;
      }

      let fingerZone = "";
      if (col === 6) fingerZone = "pinky";
      else if (col === 5) fingerZone = "pinky";
      else if (col === 4) fingerZone = "ring";
      else if (col === 3) fingerZone = "middle";
      else if (col === 2) fingerZone = "leftIndex";
      else if (col === 1) fingerZone = "leftIndex";

      let fingerRow = "";
      if (row === 1) fingerRow = "digit";
      else if (row === 2) fingerRow = "digit";
      else if (row === 3) fingerRow = "top";
      else if (row === 4) fingerRow = "home";
      else if (row === 5) fingerRow = "bottom";
      else if (row === 6) fingerRow = "bottom";

      output += `  LH_C${col}R${row}: {\n`;
      output += `    x: ${x},\n`;
      output += `    y: ${y},\n`;
      output += `    zones: ["${fingerZone}", "left", "${fingerRow}"],\n`;
      output += `  },\n`;
    }
  }

  // Generate Right Hand Keys
  // -----------------------

  // Define the right hand rows and columns structure
  const rightHandStructure = {
    1: { cols: [2, 3, 4, 5, 6] },
    2: { cols: [1, 2, 3, 4, 5, 6] },
    3: { cols: [1, 2, 3, 4, 5, 6] },
    4: { cols: [1, 2, 3, 4, 5, 6] },
    5: { cols: [1, 2, 3, 4, 5, 6] },
    6: { cols: [2, 3, 4, 5, 6] },
  };

  // Generate right hand keys
  for (let row = 1; row <= 6; row++) {
    output += `  // Right hand Row ${row}\n`;

    const structure = rightHandStructure[row];

    for (const col of structure.cols) {
      let x = rightHandStartX + col - 1;
      let y = row - 1;

      // Apply row offset to columns 5 and 6
      if (col >= 5) {
        y += row_offset;
      }

      // pinky ring middle leftIndex rightIndex
      // 6 and 5 is pinky
      // 4 = ring
      // 3 = middle
      // 2 = index
      // 1 = index

      // Determine correct finger zone
      let fingerZone = "";
      if (col === 6) fingerZone = "pinky";
      else if (col === 5) fingerZone = "pinky";
      else if (col === 4) fingerZone = "ring";
      else if (col === 3) fingerZone = "middle";
      else if (col === 2) fingerZone = "rightIndex";
      else if (col === 1) fingerZone = "rightIndex";

      let fingerRow = "";
      if (row === 1) fingerRow = "digit";
      else if (row === 2) fingerRow = "digit";
      else if (row === 3) fingerRow = "top";
      else if (row === 4) fingerRow = "home";
      else if (row === 5) fingerRow = "bottom";
      else if (row === 6) fingerRow = "bottom";

      output += `  RH_C${col}R${row}: {\n`;
      output += `    x: ${x},\n`;
      output += `    y: ${y},\n`;
      output += `    zones: ["${fingerZone}", "right", "${fingerRow}"],\n`;
      output += `  },\n`;
    }

    // Add an extra newline between rows except for the last row
    if (row < 6) {
      output += "\n";
    }
  }

  // Close the MATRIX object
  output += `};\n`;

  return output;
}

/**
 * Example usage:
 *
 * // Generate with default values (row_offset=0.5, halves_offset=2)
 * const defaultConfig = generateKeyboardGeometry();
 * console.log(defaultConfig);
 *
 * // Generate with custom values
 * const customConfig = generateKeyboardGeometry(0.75, 3);
 * console.log(customConfig);
 *
 * // Write to file (Node.js environment)
 * const fs = require('fs');
 * fs.writeFileSync('keyboard-geometry.ts', defaultConfig);
 */

// For browser environments, add this to execute and display the output
// if (typeof window !== 'undefined') {
//   // Generate geometry with default parameters
//   const generatedCode = generateKeyboardGeometry();

//   // Create a pre element to display the code
//   const pre = document.createElement('pre');
//   pre.textContent = generatedCode;
//   document.body.appendChild(pre);
// }

// // For Node.js environments
// if (typeof module !== 'undefined' && module.exports) {
//   module.exports = { generateKeyboardGeometry };
// }

// Simple CLI support if run directly with Node.js
// Run it with `npx tsx packages/keybr-keyboard/lib/geometry/generate_glove80.ts|pbcopy`
// if (typeof process !== 'undefined' && process.argv && process.argv.length > 2) {
if (typeof process !== "undefined" && process.argv) {
  const args = process.argv.slice(2);
  const rowOffset = parseFloat(args[0]) || 0.5;
  const halvesOffset = parseFloat(args[1]) || 2;

  console.log(generateKeyboardGeometry(rowOffset, halvesOffset));
}
