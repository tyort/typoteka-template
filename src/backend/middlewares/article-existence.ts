import { NextFunction, Request, Response } from "express";
import { HttpCode } from "../../const";
import { ArticleService } from "../classes";

export default (service: ArticleService) => async (req: Request, res: Response, next: NextFunction) => {
  const {articleId} = req.params;
  const article = await service.findOne(Number(articleId), false);

  if (article) {
    res.locals.article = article;
    next();

  } else {
    res
      .status(HttpCode.NOT_FOUND)
      .send(`Article with id=${articleId} not found`);
  }
};
