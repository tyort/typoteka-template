import { Router } from "express";
import { InferAttributes } from "sequelize";
import { HttpCode } from "../../const";
import { ArticleAttributes, Comment as CommentAttributes } from "../../types";
import { ArticleService, CommentService } from "../classes";
import articleExistence from "../middlewares/article-existence";
import { Article } from "../models/article";
import { Comment } from "../models/comment";

export default (app: Router, articleService: ArticleService, commentService: CommentService) => {
  const route = Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    // const {offset, limit } = req.query;
    const {needComments} = req.query; // ??????
    // const articles = limit || offset
    //  ? await articleService.findPage({limit, offset})
    //  : await articleService.findAll(!!needComments);
    const articles = await articleService.findAll(!!needComments);
    res
      .status(HttpCode.OK)
      .json(articles);
  });

  route.post(`/`, async (req, res) => {
    const cuttedArticle: ArticleAttributes = req.body;
    const article: InferAttributes<Article, {omit: `categories`}>= await articleService.create(cuttedArticle);

    res
      .status(HttpCode.CREATED)
      .json(article);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {needComments} = req.query;
    const article: Article | null = await articleService.findOne(Number(articleId), !!needComments); // ??????

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
    const affectedRows: number = await articleService.update(Number(articleId), req.body);

    return affectedRows > 0
      ? res
        .status(HttpCode.OK)
        .send(`Aricle with id${articleId} updated ${affectedRows} rows`)
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
        .json(deletedRows) // ??????? что за deletedRows
      : res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId}`);
  });

  route.get(`/:articleId/comments`, articleExistence(articleService), async (req, res) => {
    const {articleId} = req.params;
    const comments: InferAttributes<Comment, {
      omit: `id` | `text`;
    }>[] = await commentService.findAll(Number(articleId)); // ???????

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

    if (deletedRows > 0) {
      return res
        .status(HttpCode.OK)
        .json(deletedRows); // ????????

    } else {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Comment with id:${commentId} isn't founded`);
    }
  });
};
