import { Router } from "express";
import { HttpCode } from "../../const";
import { ArticleAttributes, Comment as CommentAttributes } from "../../types";
import { ArticleService, CommentService } from "../classes";
import articleExistence from "../middlewares/article-existence";
import { Article } from "../models/article";
import { Comment } from "../models/comment";

// То же самое, что и InferAttributes<Article, {omit: "categories"}>[]
export type ReformedArticleAttributes = Omit<ArticleAttributes, `categories`> & {
  id: number;
}

export default (app: Router, articleService: ArticleService, commentService: CommentService) => {
  const route = Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    // const {offset, limit } = req.query;
    const {needComments} = req.query;
    // const articles = limit || offset
    //  ? await articleService.findPage({limit, offset})
    //  : await articleService.findAll(!!needComments);

    // article(из articles) - данные в первозданном виде за счет метода get() в sequelize;
    // Добавились свойства: id, createdAt, updatedAt, categories*, comments(опицонально)* - *за счет метода include в sequelize;
    const articles: ReformedArticleAttributes[] = await articleService.findAll(!!needComments);
    res
      .status(HttpCode.OK)
      .json(articles);
  });

  route.post(`/`, async (req, res) => {
    // article - данные в первозданном виде за счет метода get() в sequelize;
    // Добавились свойства: id, createdAt, updatedAt;
    const article: ReformedArticleAttributes = await articleService.create(req.body as ArticleAttributes);

    res
      .status(HttpCode.CREATED)
      .json(article);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {needComments} = req.query;
    // Помимо свойств: id, createdAt, updatedAt, categories*, comments(опицонально)* - добавились метаданные;
    // Примечание: * - за счет include в sequelize;
    const article: Article | null = await articleService.findOne(Number(articleId), !!needComments);

    if (article) {
      return res
        .status(HttpCode.OK)
        .json(article);

    } else {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId}`);
    }
  });

  route.put(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    // Кол-во измененных строк в таблице;
    const affectedRows: number = await articleService.update(Number(articleId), req.body);

    return affectedRows > 0
      ? res
        .status(HttpCode.OK)
        .send(`Aricle with id${articleId} was updated`)
      : res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId}`);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const deletedRows: number = await articleService.delete(Number(articleId));

    return deletedRows > 0
      ? res
        .status(HttpCode.OK)
        .send(`Article with id=${articleId} was deleted`)
      : res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId}`);
  });

  route.get(`/:articleId/comments`, articleExistence(articleService), async (req, res) => {
    const {articleId} = req.params;
    // Комментарии со всеми метаданными
    const comments: Comment[] = await commentService.findAll(Number(articleId));

    res
      .status(HttpCode.OK)
      .json(comments);
  });

  route.post(`/:articleId/comments`, articleExistence(articleService), async (req, res) => {
    const {articleId} = req.params;
    const comment = await commentService.create(Number(articleId), req.body as CommentAttributes);

    return comment
      ? res
        .status(HttpCode.CREATED)
        .json(comment)
      : res
        .status(HttpCode.BAD_REQUEST)
        .send(`Comment data is invalid`);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExistence(articleService), async (req, res) => {
    const {commentId} = req.params;
    const deletedRows: number = await commentService.delete(Number(commentId));

    return deletedRows > 0
      ? res
        .status(HttpCode.OK)
        .send(`Comment with id:${commentId} was deleted`)
      : res
        .status(HttpCode.NOT_FOUND)
        .send(`Comment with id:${commentId} isn't founded`);
  });
};
