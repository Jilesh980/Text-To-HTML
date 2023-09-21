# TEXT-TO-HTML-CONVERTER

This is a command-line tool that helps to convert a simple text file or multiple files to HTML files.

## Installation

1. To clone the repository to your local machine, run the following command:

```bash
git clone https://github.com/Jilesh980/till-tool.git
cd till-tool
```

2. Install the required dependencies for the project:

```bash
npm install
```

3. Command to display the version of tool

```bash
node src/index.js -v
node src/index.js --version
```

4. The command to display help menu:

```bash
node src/index.js -h
node src/index.js --help
```

**USAGE**

1. converts one or multiple text files to HTML files.
2. Output will be stored in the same directory.
3. Automatically parses title from the text files.

Run the code in the terminal to generate the desired output:

```bash
node src/index.js process ./file-name.txt
```

This is the command if you want to convert `.md` file to `.html` file.

```bash
node src/index.js process ./file-name.md
```

##Features

1. Converts one or multiple text files to HTML files.
2. The output will be stored in the same directory as the source text file.
3. Automatically parses the title from the text files.
