import { Router } from "express";
import { getAPI } from "../api";
import { Publication } from "../../types";
import { getFormatedDate } from "../../utils";

const api = getAPI();
const mainRouter = Router();

mainRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles(),
    api.getCategories()
  ]);

  const getCountByCategory = (category: string): number => {
    return articles.filter((article: Publication) => article.category.includes(category)).length;
  };

  res.render(`main`, {
    articles: articles as Publication[],
    categories,
    getFormatedDate,
    getCountByCategory
  });
});

mainRouter.get(`/register`, (req, res) => res.send(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.send(`login`));

mainRouter.get(`/search`, async (req, res) => {
  const {title = ``} = req.query;
  const titleSpaceOff = (title as string).trim();

  try {
    const articles: Publication[] = await api.search(titleSpaceOff);
    console.log(articles);
    res.render(`search`, {
      articles,
      getFormatedDate,
      title
    });
  } catch (error) {
    // Запросы со статусом ответа 404 воспринимаются axios как завершившиеся с ошибкой.
    res.render(`search`, {
      articles: [],
      title
    });
  }
});

export default mainRouter;
