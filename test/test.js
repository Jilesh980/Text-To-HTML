/* eslint-env mocha */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { processFile } = require('../src/index.js'); // Adjust the path accordingly

describe('processFile Function Test Suite', function () {
  it('Generates HTML and writes to output directory', function () {
    const inputFilePath = './src/till-1.txt'; // Provide a test file for input
    const outputDir = './output'; // Set an output directory for testing
    const lang = 'en-US'; // Set a language for testing

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Run the function
    processFile(inputFilePath, outputDir, lang); // Use processFile function

    // Verify if the output file was created
    const expectedOutputFilePath = path.join(outputDir, 'till-1.html');
    const fileExists = fs.existsSync(expectedOutputFilePath);

    // Assertion to check if the file exists
    assert.strictEqual(fileExists, true);
  });
});
