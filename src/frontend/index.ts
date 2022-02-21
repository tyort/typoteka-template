import express from "express";
import articlesRoutes from "./routes/articles";
import myRoutes from "./routes/my";
import mainRoutes from "./routes/main";
import path from "path";

const DEFAULT_PORT = 8080;

const app = express();

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.set(`views`, path.resolve(__dirname, `templates`)); // путь к директории, в которой будут храниться все наши pug-шаблоны
app.set(`view engine`, `pug`);

// Запуск сервера
app.listen(DEFAULT_PORT);
