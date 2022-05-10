import { Op, Sequelize } from "sequelize";

class SearchService {
  private _Article;
  constructor(sequelize: Sequelize) {
    this._Article = sequelize.models.Article;
  }

  async findAll(searchText: string) {
    const enteredText = new RegExp(`${searchText}`, `i`);
    // this._articles
    //   .filter((article: Publication) => article.title.match(enteredText));
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: enteredText
        }
      },
      include: [`categories`],
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((article) => article.get());
  }
}

export { SearchService };
