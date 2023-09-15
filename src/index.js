// src/index.js
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

// Function to process a single .txt file and generate an HTML file
function processFile(filePath) {
  const fileName = path.basename(filePath, '.txt');
  const outputFilePath = `til/${fileName}.html`;
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const paragraphs = fileContent.split('\n\n').map((paragraph) => `<p>${paragraph}</p>`).join('\n');
  const htmlContent = `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${fileName}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    ${paragraphs}
  </body>
  </html>`;

  fs.writeFileSync(outputFilePath, htmlContent);
  console.log(`Generated ${outputFilePath}`);
}

// Function to process a directory of .txt files
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    if (file.endsWith('.txt')) {
      processFile(path.join(dirPath, file));
    }
  });
}

// Main command-line tool logic
yargs
  .scriptName('til')
  .usage('$0 <cmd> [args]')
  .command('process [input]', 'Process .txt file(s) and generate HTML', (yargs) => {
    yargs.positional('input', {
      describe: 'Input .txt file or folder',
      type: 'string',
    });
  }, (argv) => {
    const inputPath = argv.input;

    // Create the 'til' directory (if it doesn't exist)
    if (!fs.existsSync('til')) {
      fs.mkdirSync('til');
    }

    // If it's a directory, process all .txt files within
    if (fs.lstatSync(inputPath).isDirectory()) {
      processDirectory(inputPath);
    } else {
      processFile(inputPath);
    }
  })
  .demandCommand(1, 'You need to specify a command.')
  .version('v', 'Show the tool\'s name and version', `til v${packageJson.version}`)
  .alias('v', 'version')
  .help('h', 'Show a useful help message')
  .alias('h', 'help')
  .argv;
