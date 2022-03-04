import { NextFunction, Request, Response } from "express";
import { HttpCode } from "../../const";
import { ArticleService } from "../classes";

export default (service: ArticleService) => (req: Request, res: Response, next: NextFunction) => {
  const {articleId} = req.params;
  const article = service.findOne(articleId);

  if (article) {
    res.locals.article = article;
    next();

  } else {
    res
      .status(HttpCode.NOT_FOUND)
      .send(`Article with id=${articleId} not found`);
  }
};
