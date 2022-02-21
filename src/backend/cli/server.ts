import chalk from "chalk";
import express from "express";
import {promises} from "fs";
import { HttpCode } from "../../const";
import { Publication } from "../../types";
import path from "path";

const DEFAULT_PORT = 3005;
const FILENAME = `mocks.json`;

const app = express();
app.use(express.json()); // express.json() - middleware решит задачу конвертации JSON содержимого в объекты JavaScript.

app.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await promises.readFile(path.resolve(__dirname, `../../${FILENAME}`));
    const mocks: Publication[] = JSON.parse(fileContent.toString() as string);
    res.json(mocks);

  } catch (_err) {
    res.send([]);
  }
});

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));

export default {
  name: `--server`,
  run(args: string[]) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, () => console.info(chalk.green(`Ожидаю соединений на ${port}`)))
  }
}
