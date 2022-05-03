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
      // raw: true, ???????
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    // Здесь мы не можем использовать опцию "raw: true".
    // Опция raw возвращает по одному объекту на каждую строку результата SQL-запроса.
    // В нашем случае для каждого сочетания объявления и категории вернётся отдельная строка. Группировка результатов по объявлениям произойдёт позже.
    // Без опции raw запрос вернёт не массив «голых» данных, а массив объектов-обёрток.
    // Они содержат данные и полезные методы. Один из них — get. Он позволяет получить необработанные данные.
    return articles.map((article) => article.get());
  }
}

export { SearchService };
