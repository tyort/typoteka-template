import { Op, Sequelize } from "sequelize";

const ucFirst = (entry: string) => {
  return entry
    ? entry[0].toUpperCase() + entry.slice(1).toLowerCase()
    : entry;
};

class SearchService {
  private _Article;
  constructor(sequelize: Sequelize) {
    this._Article = sequelize.models.Article;
  }

  async findAll(searchText: string) {
    const textWithCapital = ucFirst(searchText);
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.or]: {
            [Op.substring]: searchText.toLowerCase(),
            [Op.startsWith]: textWithCapital
          }
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
