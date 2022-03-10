import { Router } from "express";
import { getAPI } from "../api";
import { Publication } from "../../types";
import dayjs from "dayjs";

const api = getAPI();
const mainRouter = Router();

mainRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles(),
    api.getCategories()
  ]);

  const getFormatedDate = (createdDate: string, formatDate: string): string => {
    return dayjs(createdDate).format(formatDate);
  }
  const getCountByCategory = (category: string): number => {
    return articles.filter((article: Publication) => article.category.includes(category)).length;
  }

  res.render(`main`, {
    articles: articles as Publication[],
    categories,
    getFormatedDate,
    getCountByCategory
  });
});

mainRouter.get(`/register`, (req, res) => res.send(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.send(`login`));
mainRouter.get(`/search`, (req, res) => res.send(`search-result`));

export default mainRouter;
