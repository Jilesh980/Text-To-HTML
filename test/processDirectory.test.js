/* eslint-env mocha */

const assert = require('assert');
const fs = require('fs');
const { processDirectory } = require('../src/index');

describe('processDirectory Function Test Suite', function () {
  const outputDir = './output'; // Set an output directory for testing
  const lang = 'en-US'; // Set a language for testing

  before(function () {
    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
  });

  it('Processes all .txt and .md files in a directory', function () {
    const inputDir = './src'; // Provide a test directory for input

    // Run the function
    processDirectory(inputDir, outputDir, lang);

    // Verify if the output files were created
    const files = fs.readdirSync(outputDir);
    const fileExists = files.some(file => file.endsWith('.html'));

    // Assertion to check if at least one HTML file exists in the output directory
    assert.strictEqual(fileExists, true);
  });

  // Add more test cases as needed
});

