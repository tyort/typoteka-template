import { Sequelize } from "sequelize";

export class CategoryService {
  private _Category;
  constructor(sequelize: Sequelize) {
    this._Category = sequelize.models.Category;
  }

  async findAll() {
    // raw: true - получаем данные в «сыром» виде — только данные, без дополнительной информации о метаданных.
    return await this._Category.findAll({raw: true});
  }
}
