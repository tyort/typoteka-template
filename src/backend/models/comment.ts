import { Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize, DataTypes } from 'sequelize';

class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  declare id: CreationOptional<number>;
  declare name: string;
}

export const defineComment = (sequelize: Sequelize) => Comment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
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
