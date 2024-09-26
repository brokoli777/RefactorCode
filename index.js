#!/usr/bin/env node

import { program } from "commander";
import fs from "fs/promises";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import chalk from "chalk";
import yoctoSpinner from "yocto-spinner";
import { stderr, stdout } from "process";

//Ascii Art for the banner
const asciiArt =
  "\r\n _____             _        ______         __               _                \r\n/  __ \\           | |       | ___ \\       / _|             | |               \r\n| /  \\/  ___    __| |  ___  | |_/ /  ___ | |_   __ _   ___ | |_   ___   _ __ \r\n| |     / _ \\  / _` | / _ \\ |    /  / _ \\|  _| / _` | / __|| __| / _ \\ | '__|\r\n| \\__/\\| (_) || (_| ||  __/ | |\\ \\ |  __/| |  | (_| || (__ | |_ | (_) || |   \r\n \\____/ \\___/  \\__,_| \\___| \\_| \\_| \\___||_|   \\__,_| \\___| \\__| \\___/ |_|   \r\n                                                                             \r\n                                                                             \r\n";

stdout.write(chalk.cyanBright(asciiArt));

const modelMap = new Map([
  ["1.5f", "gemini-1.5-flash"],
  ["1.5p", "gemini-1.5-pro"],
]);

const validModels = [];
for (const [key, value] of modelMap.entries()) {
  validModels.push(`${key} (${value})`);
}
const combinedModelsString = validModels.join(", ");

//Commander.js handling the command line arguments and options
program
  .name("RefactorCode")
  .version("1.0.0", "-v, --version", "Displays current tool version")
  .description(
    "Refactor your code to make it cleaner, correct bugs, and improve readability."
  )
  .argument("[inputFiles...]", "Input file(s) to process")
  .option(
    "-o, --output <outputFile>",
    "Output file (default: output to console)"
  )
  .option(
    "-m, --model [MODEL]",
    "Generative AI model to use (default: gemini-1.5-flash) Choices: " +
      combinedModelsString
  )
  .option(
    "-t --token-usage [tokenUsage]",
    "Will output token usage information for the refactored code"
  )
  .option(
    "-s, --stream [stream]",
    "Stream the response as it is received (default: false)"
  )
  .action((inputFiles, options) => {
    //When there are multiple files, output file argument is not allowed due to ambiguity
    if (inputFiles.length > 1 && options.output) {
      stderr.write(
        chalk.red(
          "Error: Cannot specify output file when processing multiple files\n"
        )
      );
      process.exit(1);
    }

    if (options.model && !modelMap.has(options.model)) {
      stderr.write(
        chalk.red(
          `Error: Invalid model specified. Choices: ${combinedModelsString}\n`
        )
      );
      process.exit(1);
    }

    if(options.stream && options.output || options.stream && inputFiles.length > 1 || options.stream && options.tokenUsage){
      stderr.write(chalk.red("Error: Cannot specify output file, multiple files or token usage when streaming\n"));
      process.exit(1);

    }

    if (inputFiles.length >= 1) {
      const model = modelMap.get(options.model) || modelMap.get("1.5f");
      stdout.write(chalk.yellow(`Refactoring code using model: ${model}\n`));

      const outputFile = options.output || null;
      inputFiles.forEach(async (inputFile) => {
        try {
          await refactorText(inputFile, outputFile, model, options.tokenUsage, options.stream);
        } catch (err) {
          stdout.write(chalk.red(`Error processing file: ${err.message}\n`));
        }
      });
    }
  });

const refactorText = async (inputFile, outputFile, model, tokens = false, stream = false) => {

  stdout.write(`Processing file: ${inputFile}\n`);

  if (outputFile) {
    stdout.write(`Output will be written to: ${outputFile}\n`);
  }

  try {
    const text = await readFile(inputFile);
    if (!text) {
      stderr.write(chalk.red("Error reading file: No text found\n"));
      return;
    }

    let result = null;
    if (stream) {
      result = await geminiStreamRefactor(text, model, inputFile, outputFile);
    } else {
      result = await geminiRefactor(text, model, inputFile);
    }

    //Output token usage information if token -t option is specified
    if (tokens) {
      const usageInfo = result.response.usageMetadata;
      stderr.write(
        chalk.yellow.underline.bold("\n\nUsage Data :\n") +
          chalk.magenta(
            "\nPrompt Tokens: " +
              usageInfo.promptTokenCount +
              "\nResponse Tokens: " +
              usageInfo.candidatesTokenCount +
              "\nTotal Tokens: " +
              usageInfo.totalTokenCount
          )
      );
    }

    stdout.write(chalk.bold.green(`\n\nRefactoring complete!\n\n`));
  } catch (err) {
    stderr.write(chalk.red(`Error refactoring file: ${err.message}\n`));
  }
};

const readFile = async (filename) => {
  try {
    const data = await fs.readFile(filename, "utf8");
    return data;
  } catch (err) {
    stderr.write(chalk.red(`Error reading file: ${err.message}\n`));
    return null;
  }
};

//Uses the Gemini API to refactor the code using predefined prompt, returns the refactored code and explanation
const geminiRefactor = async (text, modelType, inputFile, outputFile) => {
  try {
    const spinner = yoctoSpinner({ text: "Refactoring Code" }).start();

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({
      model: modelType,

      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            refactoredCode: {
              type: "string",
            },
            explanation: {
              type: "string",
            },
          },
          required: ["refactoredCode", "explanation"],
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
      spinner.error("Error refactoring code");
      stderr.write(
        chalk.red(
          "Error refactoring code: No refactored code or explanation returned\n"
        )
      );
    } else {
      spinner.success("Success!");
    }

    if (!outputFile) {
      stdout.write(
        chalk.yellow.underline.bold(`\nRefactored code: ${inputFile}\n\n`) +
          chalk.green(refactoredCode)
      );
    } else {
      await fs.writeFile(outputFile, refactoredCode, "utf8");
    }

    if(outputFile){
      await fs.writeFile(outputFile, refactoredCode, "utf8");
    }

    stdout.write(
      chalk.yellow.underline.bold("\n\nExplanation:\n\n") +
        chalk.blueBright(explanation)
    );

    return result;
  } catch (err) {
    stderr.write(chalk.red(`Error refactoring code: ${err.message}\n`));
  }
};

const geminiStreamRefactor = async (text, modelType, inputFile) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
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
  }
};

program.parse(process.argv);