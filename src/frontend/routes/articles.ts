import { Router } from "express";
import { getAPI } from "../api";
import dayjs from "dayjs";
import { Publication } from "../../types";

const api = getAPI();
const articlesRouter = Router();

articlesRouter.get(`/:id`, (req, res) => res.send(`Иди жопу нюхай`));
articlesRouter.get(`/category/:id`, (req, res) => res.send(`Говно ебаное`));
articlesRouter.get(`/add`, (req, res) => res.send(`Жри сука`));

articlesRouter.get(`/edit/:articleId`, async (req, res) => {
  const {articleId} = req.params;
  const article: Publication = await api.getArticle(articleId);
  const getFormatedDate = (createdDate: string, formatDate: string): string => {
    return dayjs(createdDate).format(formatDate);
  };
  res.render(`publications/publication-edit`, {article, getFormatedDate});
});

export default articlesRouter;
