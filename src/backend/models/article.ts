// InferAttributes, и InferCreationAttributes - извлекают типы атрибутов из модели;
// InferCreationAttributesработает так же, как и InferAttributesс одним исключением:
//   свойства, введенные с использованием этого CreationOptionalтипа, будут помечены как необязательные;
import { DataTypes, Sequelize, Model, InferAttributes,
  InferCreationAttributes, CreationOptional, NonAttribute, Association, HasManyAddAssociationsMixin } from "sequelize";
import { Category } from "./category";

// interface вместо class - не подойдет, т.к. в таком случае TS не сможет определитю ассоциации модели во время компиляции. И в классе мы должны их объявить
class Article extends Model<InferAttributes<Article, { omit: `categories` }>, InferCreationAttributes<Article, { omit: `categories` }>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare picture: string | null;
  declare announce: string;
  declare title: string;
  declare fullText: string | null;
  declare categories?: NonAttribute<Category[]>;
  declare addCategories: HasManyAddAssociationsMixin<Category, number>;

  declare static associations: {
    projects: Association<Article, Category>;
  };
}

export const defineArticle = (sequelize: Sequelize) => Article.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED, // UNSIGNED - только положительные значения;
      autoIncrement: true, // id can be undefined during creation when using;
      primaryKey: true,
      allowNull: false
    },
    picture: DataTypes.STRING,
    announce: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    fullText: DataTypes.STRING(1000)
  },
  {
    sequelize,
    modelName: `Article`,
    tableName: `articles`
  }
);



