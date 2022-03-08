import { Router } from "express";
import search from "../routes/search";
import articles from "../routes/articles";
import categories from "../routes/categories";
import { getMockData } from "../library/get-mocks";
import { SearchService, CategoryService, ArticleService, CommentService } from "../classes";

export const app = Router();

(async () => {
  const mockData = await getMockData();

  categories(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  articles(app, new ArticleService(mockData), new CommentService());
})();

export default app;
