import chalk from "chalk";
import { stdout } from "process";

const asciiArt =
  "\r\n _____             _        ______         __               _                \r\n/  __ \\           | |       | ___ \\       / _|             | |               \r\n| /  \\/  ___    __| |  ___  | |_/ /  ___ | |_   __ _   ___ | |_   ___   _ __ \r\n| |     / _ \\  / _` | / _ \\ |    /  / _ \\|  _| / _` | / __|| __| / _ \\ | '__|\r\n| \\__/\\| (_) || (_| ||  __/ | |\\ \\ |  __/| |  | (_| || (__ | |_ | (_) || |   \r\n \\____/ \\___/  \\__,_| \\___| \\_| \\_| \\___||_|   \\__,_| \\___| \\__| \\___/ |_|   \r\n                                                                             \r\n                                                                             \r\n";

export const showBanner = () => {
  stdout.write(chalk.cyanBright(asciiArt));
};
