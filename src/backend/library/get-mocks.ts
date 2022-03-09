import chalk from "chalk";
import { promises } from "fs";
import path from "path";
import { Publication } from "../../types";
import { getLogger } from "../library/logger";

const logger = getLogger({name: `get-mocks`});
const FILENAME = `mocks.json`;
let data: Publication[] = [];

export const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    const fileContent = await promises.readFile(path.resolve(__dirname, `../../${FILENAME}`));
    data = JSON.parse(fileContent.toString() as string);
    return data;

  } catch (err) {
    logger.error(chalk.red(`Route not found: ${(err as Error).message}`));
    data = [];
    return data;
  }
};
