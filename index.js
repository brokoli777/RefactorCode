#!/usr/bin/env node

import { program } from "commander";
import fs, { read } from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

program
  .name('RefactorCode')
  .version('1.0.0')
  .description('Make your code clean and more readable. Corrects bugs and errors in your code.')
  .argument('<inputFile>', 'Input file to process')  
  .option('-o, --output <outputFile>', 'Output file') 
  .action((inputFile, options) => {
    // If no output file is specified, append '-modified.js' to the input file name
    const outputFile = options.output || inputFile.replace(/\.js$/, '-modified.js');

    console.log(`Processing file: ${inputFile}`);
    console.log(`Output will be written to: ${outputFile}`);
        
    try {
        refactorText(inputFile, outputFile);
      } catch (err) {
        console.error('Error processing file:', err);
      }
    });


const refactorText = async (inputFile, outputFile) => {
    try {
        const text = await readFile(inputFile);
        const refactoredText = await gemminiRefactor(text);
        console.log(refactoredText);

        // Write the refactored text to the output file
        await fs.writeFile(outputFile, refactoredText);
    }
    catch (err) {
        console.error('Error with file or Gemini', err);
    }
}


const readFile = async (filename) => {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        return data;
      });
}

const gemminiRefactor = async (text) => {
    console.log("API key: ", process.env.GOOGLE_API_KEY);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Refactor this file, correcting bugs and errors if present, and making it more readable.
    Correct spelling mistakes in comments. If you find any code that is not needed, remove it.
    File content:
                    ${text}
    `;   
    const result = await model.generateContent(prompt);
    // console.log(result.response.text());
    return result.response.text();
}


program.parse(process.argv);