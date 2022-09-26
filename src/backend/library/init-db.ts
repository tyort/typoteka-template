import { Sequelize } from "sequelize";
import defineModels from "../models";
import { ArticleAttributes } from "../../types";

type Content = {
  categories?: string[];
  articles?: ArticleAttributes[];
}

type CategoryId = {
  [propertyName: string]: number;
}

export default async (sequelize: Sequelize, {categories, articles}: Content) => {
  const {Category, Article} = defineModels(sequelize);

  // force - уничтожит существующие таблицы в базе данных и создаст новые. Хороша при инициализации;
  await sequelize.sync({force: true});

  // bulkCreate - добавление нескольких новых записей.
  const categoryModels = await Category.bulkCreate(
      (categories as string[]).map((item) => ({name: item}))
  );

  // В итоге: объект с ключом "Какаятокатегория" и значением "Айдикатегории";
  const categoryIdByName: CategoryId = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  // Массив промисов
  const articlePromises = (articles as ArticleAttributes[])
    .map(async (article) => {
      const articleModel = await Article.create(article, {include: [`comments`]}); // Запись в таблице "articles"

      // Должно быть так: addCategoires(Category[] ИЛИ массив чисел, т.е. id)
      await articleModel.addCategories(
          // categoryIdByName - это объект, [category] - ключ;
          article.categories.map((category) => categoryIdByName[category]) // получим массив id категорий
      );
    });

  await Promise.all(articlePromises);
};
