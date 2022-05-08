import { Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize, DataTypes, ForeignKey } from 'sequelize';
import { Article } from "./article";

export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  declare id: CreationOptional<number>;
  declare text: string;
  declare articleId: ForeignKey<Article[`id`]>;
}

export const defineComment = (sequelize: Sequelize) => Comment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: `Comment`,
    tableName: `comments`
  }
);
