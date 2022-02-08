import packageJsonFile from "../../../package.json";
import chalk from "chalk";

const version = {
  name: `--version`,
  run() {
    const currentVersion = packageJsonFile.version;
    console.info(chalk.blue(currentVersion));
  }
};

export default version;
