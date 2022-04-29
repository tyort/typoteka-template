// InferAttributes, и InferCreationAttributes - извлекают типы атрибутов из модели;
// InferCreationAttributesработает так же, как и InferAttributesс одним исключением:
//   свойства, введенные с использованием этого CreationOptionalтипа, будут помечены как необязательные;
import { DataTypes, Sequelize, Model, InferAttributes,
  InferCreationAttributes, CreationOptional } from "sequelize";

// interface вместо class - не подойдет, т.к. в таком случае TS не сможет определитю ассоциации модели во время компиляции. И в классе мы должны их объявить
class Article extends Model<InferAttributes<Article>, InferCreationAttributes<Article>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare picture: string | null;
  declare announce: string;
  declare title: string;
  declare fullText: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
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
    fullText: DataTypes.STRING(1000),
    // technically, `createdAt` & `updatedAt` are added by Sequelize and don't need to be configured in Model.init
    // but the typings of Model.init do not know this. Add the following to mute the typing error:
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: `Article`,
    tableName: `articles`
  }
);



