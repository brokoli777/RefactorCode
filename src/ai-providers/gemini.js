import { GoogleGenerativeAI } from '@google/generative-ai';
import yoctoSpinner from 'yocto-spinner';
import fsPromises from 'fs/promises';
import chalk from 'chalk';
import { stderr, stdout } from 'process';

//Uses the Gemini API to refactor the code using predefined prompt, returns the refactored code and explanation
export const geminiRefactor = async (text, modelType, inputFile, outputFile, API_KEY) => {
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
          "explanation": "Explanation here"
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
export const geminiStreamRefactor = async (text, modelType, inputFile, API_KEY) => {
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

        JUST GIVE THE REFACTORED CODE/TEXT. THE RESPONSE WILL BE STREAMED AS IT IS RECEIVED
        Code/Text:
        ${text}
        `;

    const result = await model.generateContentStream(prompt);

    stdout.write(
      chalk.yellow.underline.bold(`\nRefactored code: ${inputFile}\n\n`)
    );

    for await (const chunk of result.stream) {
      process.stdout.write(chalk.green(chunk.text()));
    }

    return result;
  } catch (err) {
    stderr.write(chalk.red(`Error refactoring code: ${err.message}\n`));
    process.exit(1);
  }
};