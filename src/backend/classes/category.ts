import { Sequelize } from "sequelize";

export class CategoryService {
  private _Category;
  private _ArticleCategory;
  constructor(sequelize: Sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(needCount: boolean) {
    if (needCount) {
      // 1) Обратить внимание на кавычки
      //
      // SELECT
      //   categories.id,
      //   categories.name,
      //   count(*) AS n_categories
      // FROM categories
      // LEFT JOIN "ArticleCategories" AS "articlesCategories"
      //   ON "articlesCategories"."CategoryId" = categories.id
      // GROUP BY
      //   categories.id;
      //
      // Результат:
      //   id |       name       | n_categories
      // ----+------------------+--------------
      //   9 | Железо           |            7
      //   3 | Без рамки        |            7
      //   5 | IT               |            7
      //   4 | Разное           |            9
      //   6 | Музыка           |            5
      //   2 | За жизнь         |            4
      //   7 | Кино             |            7
      //   1 | Деревья          |            5
      //   8 | Программирование |            7
      const result = await this._Category.findAll({
        attributes: [
          `categories.id`,
          `categories.name`,
          [Sequelize.fn(`COUNT`, `*`), `n_categories`]
        ],
        group: [Sequelize.col(`categories.id`)],
        include: [{
          model: this._ArticleCategory,
          as: `articlesCategories`,
          attributes: []
        }]
      });
      return result.map((it) => it.get());

    } else {
      return await this._Category.findAll({raw: true});
    }
  }
}
