#!/usr/bin/env node
import chalk from "chalk";
import { program } from "commander";
import fsPromises from "fs/promises";
import path from "path";
import process, { stderr, stdout } from "process";
import { geminiRefactor, geminiStreamRefactor } from "./ai-providers/gemini.js";
import { showBanner } from "./banner.js";
import { getConfig } from "./config.js";
import { checkIfDirectory, readFile } from "./fileUtils.js";

// Display banner
showBanner();

// Load config
const config = getConfig();
const API_KEY = config?.api_keys?.API_KEY || process.env.API_KEY;

const modelMap = new Map([
  ["1.5f", "gemini-1.5-flash"],
  ["1.5p", "gemini-1.5-pro"],
]);

const validModels = [];
for (const [key, value] of modelMap.entries()) {
  validModels.push(`${key} (${value})`);
}
const combinedModelsString = validModels.join(", ");

program
  .name("RefactorCode")
  .version("1.0.0")
  .description("Refactor your code to make it cleaner and improve readability.")
  .argument("[inputPaths...]", "Input file(s) or folder(s) to process")
  .option("-o, --output <outputFile>", "Output file")
  .option("-m, --model [MODEL]", "Generative AI model to use")
  .option("-t --token-usage [tokenUsage]", "Output token usage information")
  .option("-s, --stream [stream]", "Stream the response")
  .action(async (inputPaths, options) => {
    const selectedModel = options.model || config?.preferences?.MODEL || "1.5f";

    if (!modelMap.has(selectedModel)) {
      stderr.write(
        chalk.red(
          `Invalid model specified. Choices: ${combinedModelsString}\n`,
        ),
      );
      process.exit(1);
    }

    //When there are multiple files, output file argument is not allowed due to ambiguity
    if (inputPaths.length > 1 && options.output) {
      stderr.write(
        chalk.red(
          "Error: Cannot specify output file when processing multiple files\n",
        ),
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
          "Error: Cannot specify output file, multiple files or token usage when streaming\n",
        ),
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
          for (const file of files) {
            const filePath = path.join(inputPath, file);
            await refactor(filePath, outputFile, model, options);
          }
        } else {
          await refactor(inputPath, outputFile, model, options);
        }
      }
    }
  });

program.parse(process.argv);

async function refactor(filePath, outputFile, model, options) {
  try {
    const text = await readFile(filePath);

    if (options.stream) {
      await geminiStreamRefactor(text, model, filePath, API_KEY);
    } else {
      const result = await geminiRefactor(
        text,
        model,
        filePath,
        outputFile,
        API_KEY,
      );

      // Output token usage information if token -t option is specified
      if (options.tokenUsage) {
        const usageInfo = result.response.usageMetadata;
        stderr.write(
          chalk.yellow.underline.bold("\n\nUsage Data :\n") +
            chalk.magenta(
              "\nPrompt Tokens: " +
                usageInfo.promptTokenCount +
                "\nResponse Tokens: " +
                usageInfo.candidatesTokenCount +
                "\nTotal Tokens: " +
                usageInfo.totalTokenCount,
            ),
        );
      }
    }
  } catch (err) {
    stderr.write(chalk.red(`Error processing file: ${err.message}`));
    process.exit(1);
  }
}
