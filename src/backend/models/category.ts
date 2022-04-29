import { Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize, DataTypes } from 'sequelize';

class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare id: CreationOptional<number>;
  declare name: string;
}

export const defineCategory = (sequelize: Sequelize) => Category.init(
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
    modelName: `Category`,
    tableName: `categories`
  }
);
