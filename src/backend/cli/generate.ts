import dayjs from "dayjs";
import chalk from "chalk";
import { nanoid } from "nanoid";
import { promises as fs } from "fs";
import { DEFAULT_COUNT, FILE_NAME} from "../../const";
import { Publication } from "../../types";
import { getRandomInt, getShuffledArray, generateDateByMs } from "../../utils";

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const generateComments = (count: number, comments: string[]) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(6),
    text: getShuffledArray(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generatePublications = (count: number, mockContent: {[propertyName: string]: string[]}): Publication[] => {
  const {categories, sentences: announceParts, titles, comments} = mockContent;
  return Array(count)
    .fill({})
    .map(() => ({
      id: nanoid(6),
      category: [categories[getRandomInt(0, categories.length - 1)]],
      fullText: getShuffledArray(announceParts)
        .slice(1, getRandomInt(0, announceParts.length - 1))
        .join(` `),
      announce: getShuffledArray(announceParts).slice(1, 5).join(` `),
      createdDate: dayjs(generateDateByMs()).format(`YYYY-MM-DD HH:mm:ss`),
      title: titles[getRandomInt(0, titles.length - 1)],
      comments: generateComments(getRandomInt(1, 4), comments)
    }))
  };

const readContent = async (filePath: string) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generate = {
  name: `--generate`,
  // args - параметр получаемый от пользователя
  async run(args: string[]) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const [count] = args; // count - первый элемент массива
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generatePublications(countOffer, {sentences, titles, categories, comments}));

    try {
      await fs.writeFile(`src/${FILE_NAME}`, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};

export default generate;
