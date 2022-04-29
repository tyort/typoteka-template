import { InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { defineCategory } from "./category";
import { defineComment }  from "./comment";
import { defineArticle } from "./article";

class ArticleCategory extends Model<InferAttributes<ArticleCategory>, InferCreationAttributes<ArticleCategory>> {

}

const define = (sequelize: Sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  ArticleCategory.init({}, {sequelize});

  // cascade - при удалении объявления, автоматически будут удаляться связанные с ним комментарии;
  Article.hasMany(Comment, {as: `comments`, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  Article.belongsToMany(Category, {through: ArticleCategory, as: `categories`});
  Category.belongsToMany(Article, {through: ArticleCategory, as: `articles`});
  // Category.hasMany(ArticleCategory, {as: `offerCategories`}); ?????

  return {Category, Comment, Article, ArticleCategory};
};

export default define;
