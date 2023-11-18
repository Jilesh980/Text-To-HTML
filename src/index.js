const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const toml = require('toml');

// Function to read the content of a file
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
  }
}

// Function to write content to a file
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content);
  } catch (error) {
    console.error(`Error writing to file: ${error.message}`);
    process.exit(1);
  }
}

// Function to process a single .txt or .md file and generate an HTML file
function processFile(inputFilePath, outputDir, lang) {
  const fileContent = readFile(inputFilePath);
  const htmlContent = generateHTML(fileContent, lang);

  const fileName = path.basename(inputFilePath, path.extname(inputFilePath));
  const outputFilePath = path.join(outputDir, `${fileName}.html`);
  writeFile(outputFilePath, htmlContent);

  console.log(`Converted ${inputFilePath} to HTML.`);
}

// Function to process all .txt and .md files in a directory
function processDirectory(inputDir, outputDir, lang) {
  const files = fs.readdirSync(inputDir);

  files.forEach((file) => {
    const filePath = path.join(inputDir, file);

    if (fs.lstatSync(filePath).isFile() && file.match(/\.(txt|md)$/)) {
      processFile(filePath, outputDir, lang);
    }
  });
}

function generateHTML(fileContent, lang) {
  const [title, ...paragraphs] = fileContent.split(/\n{1,}/); // Split by one or more newline characters
  const titleHtml = title ? `<title>${title}</title><h1>${title}</h1>` : '';
  const paragraphsHtml = paragraphs
    .map((paragraph) => {
      // Support for bold text using double asterisks
      paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return `<p>${paragraph}</p>`;
    })
    .join('\n');

  return `<!doctype html>
    <html lang="${lang}">
    <head>
      <meta charset="utf-8">
      ${titleHtml}
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      ${paragraphsHtml}
    </body>
    </html>`;
}

function processConfigFile(configPath) {
  const configContent = readFile(configPath);
  return toml.parse(configContent);
}

// Main command-line tool logic
function main() {
  yargs
    .scriptName('til')
    .usage('$0 <cmd> [args]')
    .command(
      'process [input]',
      'Process .txt and .md file(s) and generate HTML',
      (yargs) => {
        yargs
          .positional('input', {
            describe: 'Input .txt file or folder',
            type: 'string',
          })
          .option('output', {
            alias: 'o',
            describe: 'Output directory',
            type: 'string',
          })
          .option('lang', {
            alias: 'l',
            describe: 'language for lang attribute on <html> elements',
            type: 'string',
            default: 'en-CA',
          })
          .option('config', {
            alias: 'c',
            describe: 'Path to TOML configuration file',
            type: 'string',
          });
      },
      (argv) => {
        const inputPath = argv.input;
        let outputDir = argv.output || 'til'; // Use 'til' if not specified
        let lang = argv.lang;

        // Check if a config file is provided
        if (argv.config) {
          const configData = processConfigFile(argv.config);

          // Override options from the config file
          if (configData.output) {
            outputDir = configData.output;
          }
          if (configData.lang) {
            lang = configData.lang;
          }
        }

        // Create the output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir);
        }

        // If it's a directory, process all .txt and .md files within
        if (fs.lstatSync(inputPath).isDirectory()) {
          processDirectory(inputPath, outputDir, lang);
        } else if (inputPath.match(/\.(txt|md)$/)) {
          // Process only .txt and .md files
          processFile(inputPath, outputDir, lang);
        } else {
          console.error(
            'Invalid input. Please provide a valid .txt or .md file or folder.'
          );
          process.exit(1); // Exit with a non-zero exit code
        }
      }
    )
    .demandCommand(1, 'You need to specify a command.')
    .version('v', 'Show the tool\'s name and version', `til v1.0.0`)
    .alias('v', 'version')
    .help('h', 'Show a useful help message')
    .alias('h', 'help').argv;
}

main();

// Export the processFile function
module.exports = {
  processFile,
  processDirectory,
  // other exports if any
};
