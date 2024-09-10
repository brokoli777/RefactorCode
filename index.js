#!/usr/bin/env node

import { program } from "commander";
import fs from "fs/promises";
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';
import chalk from "chalk";
import yoctoSpinner from 'yocto-spinner';
import { stderr, stdout } from "process";


const asciiArt = "\r\n _____             _        ______         __               _                \r\n\/  __ \\           | |       | ___ \\       \/ _|             | |               \r\n| \/  \\\/  ___    __| |  ___  | |_\/ \/  ___ | |_   __ _   ___ | |_   ___   _ __ \r\n| |     \/ _ \\  \/ _` | \/ _ \\ |    \/  \/ _ \\|  _| \/ _` | \/ __|| __| \/ _ \\ | \'__|\r\n| \\__\/\\| (_) || (_| ||  __\/ | |\\ \\ |  __\/| |  | (_| || (__ | |_ | (_) || |   \r\n \\____\/ \\___\/  \\__,_| \\___| \\_| \\_| \\___||_|   \\__,_| \\___| \\__| \\___\/ |_|   \r\n                                                                             \r\n                                                                             \r\n"

stdout.write(chalk.cyanBright(asciiArt));

program
  .name('RefactorCode')
  .version('1.0.0', '-v, --version', 'Displays current tool version')
  .description('Refactor your code to make it cleaner, correct bugs, and improve readability.')
  .argument('<inputFiles...>', 'Input file(s) to process')
  .option('-o, --output <outputFile>', 'Output file (default: output to console)')
  .option('-m, --model [MODEL]', '1.5p','1.5f', "Generative AI model to use (default: gemini-1.5-flash) Choices: 1.5f (gemini-1.5-flash), 1.5p (gemini-1.5-pro)'")
  .action((inputFiles, options) => {

    if(inputFiles.length > 1 && options.output) {
      stderr.write(chalk.red('Error: Cannot specify output file when processing multiple files\n'));
      process.exit(1);
    }

    if(options.model && !["1.5f", "1.5p", "1.0p"].includes(options.model)) {
      stderr.write(chalk.red('Error: Invalid model specified. Choices: 1.5f (gemini-1.5-flash), 1.5p (gemini-1.5-pro), 1.0p (gemini-1.0-pro)\n'));
      process.exit(1);
    }

    const model = options.model === "1.5f" ? "gemini-1.5-flash" : options.model === "1.0p" ? "gemini-1.0-pro" : options.model === "1.5p" ? "gemini-1.5-pro" : "gemini-1.5-flash";
    stdout.write(chalk.yellow(`Refactoring code using model: ${model}\n`));


    const outputFile = options.output || null;
    inputFiles.forEach(async (inputFile) => {
      try {
          await refactorText(inputFile, outputFile, model); 
      } catch (err) {
          stdout.write(chalk.red(`Error processing file: ${err.message}\n`));
      }
    });
    

  });

const refactorText = async (inputFile, outputFile, model) => {

  stdout.write(`Processing file: ${inputFile}\n`);

  if(outputFile) {
    stdout.write(`Output will be written to: ${outputFile}\n`);
  }

    try {
        const text = await readFile(inputFile);
        if (!text) {
            throw new Error('File is empty or does not exist');
        }
        
        const spinner = yoctoSpinner({text: 'Refactoring Code'}).start();
        setTimeout(() => {
          spinner.stop();
        }, 12000);

        const { refactoredCode, explanation } = await geminiRefactor(text, model);

        if(!refactoredCode || !explanation) {
            spinner.error('Error refactoring code');
            throw new Error('Error refactoring code');
        }
        else {
          spinner.success('Success!');
        }
        
        if(! outputFile) {
        stdout.write(chalk.yellow.underline.bold(`\nRefactored code: ${inputFile}\n\n`)+chalk.green(refactoredCode));
        }
        else {
          await fs.writeFile(outputFile, refactoredCode, 'utf8');
        }
        stdout.write(chalk.yellow.underline.bold("\n\nExplanation:\n\n")+chalk.blueBright(explanation));

        stdout.write(chalk.bold.green(`\n\nRefactoring complete!`));
    } catch (err) {
        stderr.write(chalk.red(`Error refactoring file: ${err.message}\n`));
        throw new Error(`Error with file or gemmini API: ${err.message}`);
    }
};

const readFile = async (filename) => {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return data;
    } catch (err) {
        throw new Error(`Error reading file ${filename}: ${err.message}`);
    }
};

const geminiRefactor = async (text, modelType) => {
    
    try {
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({ 
          model: modelType,
          
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                "type": "object",
                "properties": {
                  "refactoredCode": {
                    "type": "string"
                  },
                  "explanation": {
                    "type": "string"
                  }
                },
                "required": [
                  "refactoredCode",
                  "explanation"
                ]
              },
          },
        });

        const prompt = `
        Refactor the following file by doing the following:
        1. Remove unnecessary whitespace and unreachable code.
        2. Remove redundant loops and correct inefficient code.
        3. Correct any bugs.
        4. Improve performance.
        5. Add comments and improve readability.
        6. Make large functions more modular.
        Also provide a brief explanation of the changes made.

        For Example:
        {
          "refactored_text": "Refactored code here",
          "explanation": "1. Removed unnecessary whitespace and improved readability. \n2. Removed a redundant loop.\n3. Corrected a bug in the divide function."
        }\n\n

        Code/Text:
        ${text}
        `;

         const result = await model.generateContent(prompt);

        const { explanation, refactoredCode } = JSON.parse(result.response.text());

        return { refactoredCode, explanation };

    } catch (err) {
        throw new Error(`Error with AI refactoring: ${err.message}`);
    }
};

program.parse(process.argv);
