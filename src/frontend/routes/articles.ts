import { Router } from "express";
import { getAPI } from "../api";
import dayjs from "dayjs";
import { Publication } from "../../types";

const api = getAPI();
const articlesRouter = Router();

articlesRouter.get(`/category/:id`, (req, res) => res.send(`Говно ебаное`));

articlesRouter.get(`/add`, async (req, res) => {
  const getFormatedDate = (createdDate: string, formatDate: string): string => {
    return dayjs(createdDate).format(formatDate);
  };
  res.render(`publications/publication-empty`, {getFormatedDate});
});

articlesRouter.get(`/:id`, (req, res) => res.send(`Иди жопу нюхай`));

articlesRouter.get(`/edit/:articleId`, async (req, res) => {
  const {articleId} = req.params;
  const article: Publication = await api.getArticle(articleId);
  const getFormatedDate = (createdDate: string, formatDate: string): string => {
    return dayjs(createdDate).format(formatDate);
  };
  res.render(`publications/publication-edit`, {article, getFormatedDate});
});

export default articlesRouter;
