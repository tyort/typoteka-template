import chalk from "chalk";
import express from "express";
import { ErrorRequestHandler } from "express-serve-static-core";
import { getLogger } from "../library/logger";
import { HttpCode } from "../../const";
import routes from "../routes";
import sequelize from "../library/sequelize";

const logger = getLogger({name: `backend-server`});
const DEFAULT_PORT = 3005;

const app = express();
app.use(express.json()); // express.json() - middleware решит задачу конвертации JSON содержимого в объекты JavaScript.

// Фиксируем вообще все запросы к API и коды ответа на них.
app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    const color = res.statusCode >= 400 ? `red` : `green`;
    logger.info(chalk[color](`Response status code ${res.statusCode}`));
  });
  next();
});

app.use(`/api`, routes);

// Фиксируем события, когда происходит запрос на несуществующий маршрут.
app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .send(`Not found`);
  logger.error(chalk.red(`Route not found: ${req.url}`));
});

const errorRequestMiddleware: ErrorRequestHandler = (err, _req, _res, _next) => {
  logger.error(`An error occured on processing request: ${err.message}`);
};

app.use(errorRequestMiddleware);

export default {
  name: `--server`,
  async run(args: string[]) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      logger.info(`Connection to database established`);

    } catch (err) {
      logger.error(`An error occured: ${(err as Error).message}`);
      process.exit(1);
    }

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      app.listen(port, () => {
          logger.info(chalk.green(`Listening to connections on ${port}`));
      });

    } catch (err) {
      logger.error(chalk.red(`An error occurred: ${(err as Error).message}`));
      process.exit(1);
    }
  }
};
