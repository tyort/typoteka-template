import dayjs from "dayjs";
import chalk from "chalk";
import { nanoid } from "nanoid";
import { promises as fs } from "fs";
import { DEFAULT_COUNT } from "../../const";
import { ArticleAttributes } from "../../types";
import initDatabase from "../library/init-db";
import { getRandomInt, getShuffledArray, generateDateByMs,  getRandomSubarray } from "../../utils";
import { getLogger } from "../library/logger";
import sequelize from "../library/sequelize";

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const logger = getLogger({name: `filldb`});

const generateComments = (count: number, comments: string[]) => (
  Array(count).fill({}).map(() => ({
    text: getShuffledArray(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generatePublications = (count: number, mockContent: {[propertyName: string]: string[]}): ArticleAttributes[] => {
  const {categories, sentences: announceParts, titles, comments} = mockContent;
  return Array(count)
    .fill({})
    .map(() => ({
      picture: `${nanoid(6)}.png`,
      categories: getRandomSubarray(categories),
      fullText: getShuffledArray(announceParts)
        .slice(1, 4)
        .join(` `),
      announce: getShuffledArray(announceParts).slice(1, 3).join(` `),
      createdDate: dayjs(generateDateByMs()).format(`YYYY-MM-DD HH:mm:ss`),
      title: titles[getRandomInt(0, titles.length - 1)],
      comments: generateComments(getRandomInt(1, 4), comments)
    }));
  };

const readContent = async (filePath: string) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);

  } catch (err) {
    logger.error(chalk.red(`Error when reading file: ${(err as Error).message}`));
    return [];
  }
};

const generate = {
  name: `--filldb`,
  // args - параметр получаемый от пользователя
  async run(args: string[]) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      logger.info(`Connection to database established`);

    } catch (err) {
      logger.error(chalk.red(`An error occured: ${(err as Error).message}`));
      process.exit(1);
    }

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const [count] = args; // count - первый элемент массива
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = generatePublications(countArticle, {sentences, titles, categories, comments});

    return initDatabase(sequelize, {articles, categories});
  }
};

export default generate;
