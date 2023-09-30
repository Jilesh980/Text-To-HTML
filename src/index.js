const fs = require("fs");
const path = require("path");
const { argv } = require("process");
const yargs = require("yargs");

// Function to process a single .txt or .md file and generate an HTML file
function processFile(filePath, outputDir, lang) {
  try {
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

    fs.writeFileSync(outputFilePath, htmlContent);
    console.log(`Generated ${outputFilePath}`);
  } catch (error) {
    console.error(`Error processing file: ${error.message}`);
    process.exit(1); // Exit with a non-zero exit code
  }
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
        })
        .option("lang", {
          alias: "l",
          describe: "language for lang attribute on <html> elements",
          type: "string",
          default: "en-CA",
        });
    },
    (argv) => {
      const inputPath = argv.input;
      const outputDir = argv.output || "til"; // Use 'til' if not specified
      const lang = argv.lang;

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
        console.log(`Converted ${inputPath} to HTML.`);
      } else {
        console.error(
          "Invalid input. Please provide a valid .txt or .md file or folder."
        );
        process.exit(1); // Exit with a non-zero exit code
      }
    }
  )
  .demandCommand(1, "You need to specify a command.")
  .version("v", "Show the tool's name and version", `til v1.0.0`)
  .alias("v", "version")
  .help("h", "Show a useful help message")
  .alias("h", "help").argv;
