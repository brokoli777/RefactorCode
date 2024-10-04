#!/usr/bin/env node

import { program } from 'commander';
import fsPromises from 'fs/promises';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import chalk from 'chalk';
import yoctoSpinner from 'yocto-spinner';
import { stderr, stdout } from 'process';
import toml from 'toml';

//Ascii Art for the banner
const asciiArt =
  "\r\n _____             _        ______         __               _                \r\n/  __ \\           | |       | ___ \\       / _|             | |               \r\n| /  \\/  ___    __| |  ___  | |_/ /  ___ | |_   __ _   ___ | |_   ___   _ __ \r\n| |     / _ \\  / _` | / _ \\ |    /  / _ \\|  _| / _` | / __|| __| / _ \\ | '__|\r\n| \\__/\\| (_) || (_| ||  __/ | |\\ \\ |  __/| |  | (_| || (__ | |_ | (_) || |   \r\n \\____/ \\___/  \\__,_| \\___| \\_| \\_| \\___||_|   \\__,_| \\___| \\__| \\___/ |_|   \r\n                                                                             \r\n                                                                             \r\n";

stdout.write(chalk.cyanBright(asciiArt));

const modelMap = new Map([
  ['1.5f', 'gemini-1.5-flash'],
  ['1.5p', 'gemini-1.5-pro'],
]);

const validModels = [];
for (const [key, value] of modelMap.entries()) {
  validModels.push(`${key} (${value})`);
}
const combinedModelsString = validModels.join(', ');

// Get the API keys and other preferences (i.e. MODEL) from the TOML config file. If no TOML file exists, config = null, use the .env variables
const config = getConfig();
const API_KEY = config?.api_keys?.API_KEY || process.env.API_KEY;

//Commander.js handling the command line arguments and options
program
  .name('RefactorCode')
  .version('1.0.0', '-v, --version', 'Displays current tool version')
  .description(
    'Refactor your code to make it cleaner, correct bugs, and improve readability.'
  )
  .argument('[inputPaths...]', 'Input file(s) or folder(s) to process')
  .option(
    '-o, --output <outputFile>',
    'Output file (default: output to console)'
  )
  .option(
    '-m, --model [MODEL]',
    'Generative AI model to use (default: gemini-1.5-flash) Choices: ' +
      combinedModelsString
  )
  .option(
    '-t --token-usage [tokenUsage]',
    'Will output token usage information for the refactored code'
  )
  .option(
    '-s, --stream [stream]',
    'Stream the response as it is received (default: false)'
  )
  .action(async (inputPaths, options) => {
    const selectedModel = options.model || config?.preferences?.MODEL || '1.5f';

    //When there are multiple files, output file argument is not allowed due to ambiguity
    if (inputPaths.length > 1 && options.output) {
      stderr.write(
        chalk.red(
          'Error: Cannot specify output file when processing multiple files\n'
        )
      );
      process.exit(1);
    }

    if (selectedModel && !modelMap.has(selectedModel)) {
      stderr.write(
        chalk.red(
          `Error: Invalid model specified. Choices: ${combinedModelsString}\n`
        )
      );
      process.exit(1);
    }

    if (
      (options.stream && options.output) ||
      (options.stream && inputPaths.length > 1) ||
      (options.stream && options.tokenUsage)
    ) {
      stderr.write(
        chalk.red(
          'Error: Cannot specify output file, multiple files or token usage when streaming\n'
        )
      );
      process.exit(1);
    }

    if (inputPaths.length >= 1) {
      const model = modelMap.get(selectedModel);
      stdout.write(chalk.yellow(`Refactoring code using model: ${model}\n`));

      const outputFile = options.output || null;

      for (const inputPath of inputPaths) {
        const isDirectory = await checkIfDirectory(inputPath);

        if (isDirectory) {
          const files = await fsPromises.readdir(inputPath);
          const filePaths = files.map((file) => path.join(inputPath, file));

          for (const filePath of filePaths) {
            try {
              await refactorText(
                filePath,
                outputFile,
                model,
                options.tokenUsage
              );
            } catch (err) {
              stdout.write(
                chalk.red(`Error processing file: ${err.message}\n`)
              );
              process.exit(1);
            }
          }
        } else {
          // Process single file
          try {
            await refactorText(
              inputPath,
              outputFile,
              model,
              options.tokenUsage,
              options.stream
            );
          } catch (err) {
            stdout.write(chalk.red(`Error processing file: ${err.message}\n`));
            process.exit(1);
          }
        }
      }
    }
  });

const checkIfDirectory = async (inputPath) => {
  try {
    const stat = await fsPromises.lstat(inputPath);
    return stat.isDirectory();
  } catch (err) {
    stderr.write(chalk.red(`Error checking path: ${err.message}\n`));
    return false;
  }
};

const refactorText = async (
  inputFile,
  outputFile,
  model,
  tokens = false,
  stream = false
) => {
  stdout.write(`Processing file: ${inputFile}\n`);

  if (outputFile) {
    stdout.write(`Output will be written to: ${outputFile}\n`);
  }

  try {
    const text = await readFile(inputFile);
    if (!text) {
      stderr.write(chalk.red('Error reading file: No text found\n'));
      return;
    }

    let result = null;
    if (stream) {
      result = await geminiStreamRefactor(text, model, inputFile);
    } else {
      result = await geminiRefactor(text, model, inputFile, outputFile);
    }

    //Output token usage information if token -t option is specified
    if (tokens) {
      const usageInfo = result.response.usageMetadata;
      stderr.write(
        chalk.yellow.underline.bold('\n\nUsage Data :\n') +
          chalk.magenta(
            '\nPrompt Tokens: ' +
              usageInfo.promptTokenCount +
              '\nResponse Tokens: ' +
              usageInfo.candidatesTokenCount +
              '\nTotal Tokens: ' +
              usageInfo.totalTokenCount
          )
      );
    }

    stdout.write(chalk.bold.green(`\n\nRefactoring complete!\n\n`));
  } catch (err) {
    stderr.write(chalk.red(`Error refactoring file: ${err.message}\n`));
    process.exit(1);
  }
};

const readFile = async (filename) => {
  try {
    const data = await fsPromises.readFile(filename, 'utf8');
    return data;
  } catch (err) {
    stderr.write(chalk.red(`Error reading file: ${err.message}\n`));
    return null;
  }
};

//Uses the Gemini API to refactor the code using predefined prompt, returns the refactored code and explanation
const geminiRefactor = async (text, modelType, inputFile, outputFile) => {
  try {
    const spinner = yoctoSpinner({ text: 'Refactoring Code ' }).start();

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: modelType,

      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            refactoredCode: {
              type: 'string',
            },
            explanation: {
              type: 'string',
            },
          },
          required: ['refactoredCode', 'explanation'],
        },
      },
    });

    const prompt = `
        Refactor the following file by doing the following:
        1. Remove unnecessary whitespace and unreachable or commented out code.
        2. Remove redundant loops and correct inefficient code.
        3. Correct any bugs and errors (Syntax Errors, Performance Issues, Compatibility Issues,Functional, Unit Level and Logical Bugs, Out of Bound Errors, Security Bugs, Usability Bugs, Calculation Bugs).
        4. Improve performance where it can be done without changing existing functionality.
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

    spinner.stop();

    if (!refactoredCode || !explanation) {
      spinner.error('Error refactoring code');
      stderr.write(
        chalk.red(
          'Error refactoring code: No refactored code or explanation returned\n'
        )
      );
    } else {
      spinner.success('Success!');
    }

    if (!outputFile) {
      stdout.write(
        chalk.yellow.underline.bold(`\nRefactored code: ${inputFile}\n\n`) +
          chalk.green(refactoredCode)
      );
    } else {
      await fsPromises.writeFile(outputFile, refactoredCode, 'utf8');
    }

    stdout.write(
      chalk.yellow.underline.bold('\n\nExplanation:\n\n') +
        chalk.blueBright(explanation)
    );

    return result;
  } catch (err) {
    stderr.write(chalk.red(`Error refactoring code: ${err.message}\n`));
    process.exit(1);
  }
};

//Streaming version of the refactoring code
const geminiStreamRefactor = async (text, modelType, inputFile) => {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: modelType });

    const prompt = `
        Refactor the following file by doing the following:
        1. Remove unnecessary whitespace and unreachable or commented out code.
        2. Remove redundant loops and correct inefficient code.
        3. Correct any bugs and errors (Syntax Errors, Performance Issues, Compatibility Issues,Functional, Unit Level and Logical Bugs, Out of Bound Errors, Security Bugs, Usability Bugs, Calculation Bugs).
        4. Improve performance where it can be done without changing existing functionality.
        5. Add comments and improve readability.
        6. Make large functions more modular.

        JUST GIVE THE CODE/TEXT TO BE REFACTORED. THE RESPONSE WILL BE STREAMED AS IT IS RECEIVED
        Code/Text:
        ${text}
        `;

    const result = await model.generateContentStream(prompt);

    stdout.write(
      chalk.yellow.underline.bold(`\nRefactored code: ${inputFile}\n\n`)
    );

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      process.stdout.write(chalk.green(chunkText));
    }

    return result;
  } catch (err) {
    stderr.write(chalk.red(`Error refactoring code: ${err.message}\n`));
    process.exit(1);
  }
};

// Retrieve the values within the TOML config file (.refactorcode.toml), and export them as the `config` object
function getConfig() {
  // Logic to read the values from the .refactorcode.toml config file in the home directory
  const __homedir = os.homedir();

  // Look for the relevant TOML file in home directory
  const tomlFilePath = path.join(__homedir, '.refactorcode.toml');

  // If the file doesn't exist, no need to parse the file for defaults
  if (!fs.existsSync(tomlFilePath)) {
    return null;
  }

  let config = {};
  try {
    const configFileContent = fs.readFileSync(tomlFilePath, 'utf-8');
    config = toml.parse(configFileContent);
  } catch (error) {
    console.error(`Error reading TOML file: ${error.message}`);
    // If there was an error with parsing an existing file, exit.
    process.exit(1);
  }

  // Returns config values that were parsed from .refactorcode.toml
  return config;
}

program.parse(process.argv);
