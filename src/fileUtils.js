import fsPromises from "fs/promises";
import chalk from "chalk";

export const readFile = async (filename) => {
  try {
    const data = await fsPromises.readFile(filename, "utf8");
    return data;
  } catch (err) {
    console.error(chalk.red(`Error reading file: ${err.message}`));
    return null;
  }
};

export const checkIfDirectory = async (inputPath) => {
  try {
    const stat = await fsPromises.lstat(inputPath);
    return stat.isDirectory();
  } catch (err) {
    console.error(chalk.red(`Error checking path: ${err.message}`));
    return false;
  }
};
