// src/index.js
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");

// Function to process a single .txt or .md file and generate an HTML file
function processFile(filePath, outputDir) {
  const fileExt = path.extname(filePath);
  const fileName = path.basename(filePath, fileExt);
  const outputFilePath = path.join(outputDir, `${fileName}.html`);
  const fileContent = fs.readFileSync(filePath, "utf8");

  // Extract title and content
  const [title, ...paragraphs] = fileContent.split(/\n{1,}/); // Split by one
  const titleHtml = title ? `<title>${title}</title><h1>${title}</h1>` : "";
  const paragraphsHtml = paragraphs
    .map((paragraph) => {
      // Support for bold text using double asterisks
      paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return `<p>${paragraph}</p>`;
    })
    .join("\n");

  const htmlContent = `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    ${titleHtml}
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    ${paragraphsHtml}
  </body>
  </html>`;

  fs.writeFileSync(outputFilePath, htmlContent);
  console.log(`Generated ${outputFilePath}`);
}

// Function to process a directory of .txt and .md files
function processDirectory(dirPath, outputDir) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      processDirectory(filePath, outputDir);
    } else if (file.match(/\.(txt|md)$/)) {
      // Process only .txt and .md files
      processFile(filePath, outputDir);
      console.log(`Converted ${filePath} to HTML.`);
    }
  });
}

// Main command-line tool logic
yargs
  .scriptName("til")
  .usage("$0 <cmd> [args]")
  .command(
    "process [input]",
    "Process .txt and .md file(s) and generate HTML",
    (yargs) => {
      yargs
        .positional("input", {
          describe: "Input .txt file or folder",
          type: "string",
        })
        .option("output", {
          alias: "o",
          describe: "Output directory",
          type: "string",
        });
    },
    (argv) => {
      const inputPath = argv.input;
      const outputDir = argv.output || "til"; // Use 'til' if not specified

      // Create the output directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      // If it's a directory, process all .txt and .md files within
      if (fs.lstatSync(inputPath).isDirectory()) {
        processDirectory(inputPath, outputDir);
      } else if (inputPath.match(/\.(txt|md)$/)) {
        // Process only .txt and .md files
        processFile(inputPath, outputDir);
        console.log(`Converted ${inputPath} to HTML.`);
      } else {
        console.error(
          "Invalid input. Please provide a valid .txt or .md file or folder."
        );
      }
    }
  )
  .demandCommand(1, "You need to specify a command.")
  .version("v", "Show the tool's name and version", `til v1.0.0`)
  .alias("v", "version")
  .help("h", "Show a useful help message")
  .alias("h", "help").argv;
