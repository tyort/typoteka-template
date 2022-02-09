import chalk from "chalk";
import { IncomingMessage, ServerResponse, createServer } from "http";
import {promises} from "fs";
import { HttpCode } from "../../const";
import { Publication } from "../../types";
import path from "path";

const DEFAULT_PORT = 3005;
const FILENAME = `mocks.json`;

const sendResponse = (res: ServerResponse, statusCode: HttpCode, message: string) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.statusCode = statusCode;

  // writeHead - позволяет отправить заголовок ответа на запрос.
  //             Первым параметром он принимает код состояния (трёхзначное числовое значение),
  //             а вторым — объект с необходимыми заголовками.
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  // Получается .writeHead повлияет на кодировку передаваемого контента в .end
  res.end(template);
};

// Запустится при запросе от клиента
const onClientConnect = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent: Buffer = await promises.readFile(`src/${FILENAME}`);
        const mocks: Publication[] = JSON.parse(fileContent.toString() as string);
        const message = mocks
          .map((post: Publication) => `<li>${post.title}</li>`)
          .join(``);
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);

      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }

      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
  }
};

export default {
  name: `--server`,
  run(args: string[]) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    createServer(onClientConnect)
    // Начинаем прослушивать порт и принимать соединения. Колбэк решили пропустить в .listen
    .listen(port)
    // on - подписываемся на событие. А также опишем второй параметр(колбэк)
    .on(`listening`, (err: Error) => {
      if (err) {
        return console.error(`Ошибка при создании сервера`, err);
      }

      return console.info(chalk.green(`Ожидаю соединений на ${port}`));
    });
  }
}
