import express from "express";
import articlesRoutes from "./routes/articles";
import myRoutes from "./routes/my";
import mainRoutes from "./routes/main";

const DEFAULT_PORT = 8080;

const app = express();

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

// Запуск сервера
app.listen(DEFAULT_PORT);
