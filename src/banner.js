/* eslint-disable no-irregular-whitespace */
import chalk from "chalk";
import { stdout } from "process";

const asciiArt =
`
█▀█ █▀▀ █▀▀ ▄▀█ █▀▀ ▀█▀ █▀█ █▀█ █▀▀ █▀█ █▀▄ █▀▀
█▀▄ ██▄ █▀░ █▀█ █▄▄ ░█░ █▄█ █▀▄ █▄▄ █▄█ █▄▀ ██▄
`

export const showBanner = () => {
  stdout.write(chalk.cyanBright(asciiArt));
};
