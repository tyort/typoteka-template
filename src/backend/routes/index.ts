import { Router } from "express";
import search from "../routes/search";
import articles from "../routes/articles";
import categories from "../routes/categories";
import { SearchService, CategoryService, ArticleService, CommentService } from "../classes";
import defineModels from "../models";
import sequelize from "../library/sequelize";

export const app = Router();

const definedModels = defineModels(sequelize);

categories(app, new CategoryService(sequelize));
search(app, new SearchService(sequelize));
articles(app, new ArticleService(sequelize, definedModels), new CommentService(sequelize));

export default app;
