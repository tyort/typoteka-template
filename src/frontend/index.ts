import express, { NextFunction, Request, Response } from "express";
import articlesRoutes from "./routes/articles";
import myRoutes from "./routes/my";
import mainRoutes from "./routes/main";
import path from "path";
import { HttpCode } from "../const";

const DEFAULT_PORT = 8080;

const app = express();

app.use(express.static(path.resolve(__dirname, `public`)));
app.use(express.static(path.resolve(__dirname, `upload`)));

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use((_req: Request, res: Response) => {
  res.status(HttpCode.BAD_REQUEST).render(`errors/404`);
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.set(`views`, path.resolve(__dirname, `templates`)); // путь к директории, в которой будут храниться все наши pug-шаблоны
app.set(`view engine`, `pug`);

// Запуск сервера
app.listen(DEFAULT_PORT);
