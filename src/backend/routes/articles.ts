import { Router } from "express";
import { HttpCode } from "../../const";
import { Publication, Comment } from "../../types";
import { ArticleService, CommentService } from "../classes";
import articleExistence from "../middlewares/article-existence";

export default (app: Router, articleService: ArticleService, commentService: CommentService) => {
  const route = Router();
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();

    res
      .status(HttpCode.OK)
      .json(articles);
  });

  route.post(`/`, (req, res) => {
    type ShortPublication = Omit<Publication, `id` | `comments`>;
    const cuttedArticle = req.body as ShortPublication; // ????? проверить, как поведет в браузере
    const article = articleService.create(cuttedArticle);

    res
      .status(HttpCode.CREATED)
      .json(article);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

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

  route.put(`/:articleId`, (req, res) => {
    type ShortPublication = Omit<Publication, `id` | `comments`>;
    const cuttedArticle = req.body as ShortPublication;
    const {articleId} = req.params;
    const existedArticle = articleService.findOne(articleId);

    if (existedArticle) {
      const updatedArticle: Publication = articleService.update(articleId, cuttedArticle);
      return res
        .status(HttpCode.OK)
        .json(updatedArticle);

    } else {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId}`);
    }
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const currentArticle = articleService.delete(articleId);

    if (currentArticle) {
      return res
        .status(HttpCode.OK)
        .json(currentArticle);

    } else {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId}`);
    }
  });

  route.get(`/:articleId/comments`, articleExistence(articleService), (req, res) => {
    const {article} = res.locals; // пришло от middleware articleExistence
    const comments: Comment[] = commentService.findAll(article);

    res
      .status(HttpCode.OK)
      .json(comments);
  });

  route.post(`/:articleId/comments`, articleExistence(articleService), (req, res) => {
    const {article} = res.locals;
    type ShortComment = Omit<Comment, `id`>;
    const cuttedComment = req.body as ShortComment;
    const comment: Comment | null = commentService.create(article, cuttedComment);

    if (comment) {
      return res
        .status(HttpCode.CREATED)
        .json(comment);

    } else {
      return res
        .status(HttpCode.BAD_REQUEST)
        .send(`Comment data is invalid`);
    }
  });

  route.delete(`/:articleId/comments/:commentId`, articleExistence(articleService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.delete(article, commentId);

    if (deletedComment) {
      return res
        .status(HttpCode.OK)
        .json(deletedComment);

    } else {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Comment with id:${commentId} isn't founded`);
    }
  });
};
