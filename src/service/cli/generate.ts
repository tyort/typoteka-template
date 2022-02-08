import dayjs from "dayjs";
import chalk from "chalk";
import fs from "fs";
import { categories, announceParts, titles, DEFAULT_COUNT, FILE_NAME} from "../../const";
import { Publication } from "../../types";
import { getRandomInt, getShuffledArray, generateDateByMs } from "../../utils";

const generatePublications = (count: number): Publication[] => (
  Array(count)
    .fill({})
    .map(() => ({
      category: [categories[getRandomInt(0, categories.length - 1)]],
      fullText: getShuffledArray(announceParts)
        .slice(1, getRandomInt(0, announceParts.length - 1))
        .join(` `),
      announce: getShuffledArray(announceParts).slice(1, 5).join(` `),
      createdDate: dayjs(generateDateByMs()).format(`YYYY-MM-DD HH:mm:ss`),
      title: titles[getRandomInt(0, titles.length - 1)],
    }))
);

const generate = {
  name: `--generate`,
  // args - параметр получаемый от пользователя
  run(args: string[]) {
    const [count] = args; // count - первый элемент массива
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generatePublications(countOffer));

    // fs - имеет различные функции для выполнения операций с файловой системой:
    // создание, чтение, запись, удаление и так далее.
    fs.writeFile(`src/${FILE_NAME}`, content, (err) => {
      return err
        ? console.error(chalk.red(`Can't write data to file...`))
        : console.log(chalk.green(`Operation success. File created.`));
    });

  }
};

export default generate;
