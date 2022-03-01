import { nanoid } from "nanoid";
import { Publication } from "../../types";

export class ArticleService {
  private _articles;
  constructor(articles: Publication[]) {
    this._articles = articles;
  }

  create(article: Omit<Publication, `id`>) {
    const newArticle: Publication = {...article, id: nanoid(6), comments: []}
    this._articles.push(newArticle);
    return newArticle;
  }

  delete(articleId: string) {
    const deletedArticle = this._articles.find((article) => article.id === articleId);
    this._articles = deletedArticle
      ? this._articles.filter((item) => item.id !== articleId)
      : this._articles

    return deletedArticle ? deletedArticle : null;
  }

  findAll() {
    return this._articles;
  }

  findOne(articleId: string) {
    return this._articles.find((article) => article.id === articleId);
  }

  update(articleId: string, article: Omit<Publication, `id`>) {
    const oldArticle = this._articles.find((publication) => publication.id === articleId) as Publication;
    return {...oldArticle, article};
  }
}