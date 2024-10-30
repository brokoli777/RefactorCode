import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as toml from "toml";
import "dotenv/config";
import process from "process";

// Retrieve the values within the TOML config file (.refactorcode.toml), and export them as the `config` object
export function getConfig() {
  // Logic to read the values from the .refactorcode.toml config file in the home directory
  const __homedir = os.homedir();
  // Look for the relevant TOML file in home directory
  const tomlFilePath = path.join(__homedir, ".refactorcode.toml");

  // If the file doesn't exist, no need to parse the file for defaults
  if (!fs.existsSync(tomlFilePath)) {
    return null;
  }

  let config = {};
  try {
    const configFileContent = fs.readFileSync(tomlFilePath, "utf-8");
    config = toml.parse(configFileContent);
  } catch (error) {
    console.error(`Error reading TOML file: ${error.message}`);
    // If there was an error with parsing an existing file, exit.
    process.exit(1);
  }

  // Returns config values that were parsed from .refactorcode.toml
  return config;
}
