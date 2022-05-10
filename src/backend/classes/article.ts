import { Sequelize } from "sequelize";
import { ArticleAttributes } from "../../types";
import { Article as SameArticle} from "../models/article";
// По учебнику: Article === sequelize.models.Article

type AllModels = {
  Article: typeof SameArticle
}
export class ArticleService {
  private _Article;
  private _Comment;
  private _Category;
  constructor(sequelize: Sequelize, {Article}: AllModels) {
    this._Article = Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(articleData: ArticleAttributes) {
    const newArticle = await this._Article.create(articleData);
    await newArticle.addCategories(articleData.categories as number[]);
    return newArticle.get();
  }

  async delete(articleId: number) {
    const deletedRows = await this._Article.destroy({
      where: {id: articleId}
    });
    return deletedRows;
  }

  async findAll(needComments: boolean) {
    const include = needComments
      ? [`categories`, `comments`]
      : [`categories`];

    const articles = await this._Article.findAll({
      include,
      // false - появляется доступ к методу get(), который избавляет информацию от метаданных.
      // true - нет метода get(). Нет метаданных. Есть доп.свойства(столбцы) для понимания связи с другими таблицами;
      // raw: true(или false),
      order: [
        [`createdAt`, `DESC`]
      ]
    });
    return articles.map((article) => article.get());
  }

  async findOne(articleId: number, needComments: boolean) {
    const include = needComments
    ? [`categories`, `comments`]
    : [`categories`];
    const article = await this._Article.findByPk(articleId, {include});
    return article;
  }

  // async findPage({limit, offset}) {
  //   const {count, rows} = await this._Offer.findAndCountAll({
  //     limit,
  //     offset,
  //     include: [Aliase.CATEGORIES],
  //     order: [
  //       [`createdAt`, `DESC`]
  //     ],
  //     distinct: true
  //   });
  //   return {count, offers: rows};
  // }

  async update(articleId: number, article: ArticleAttributes) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id: articleId}
    });
    return affectedRows;
  }
}
