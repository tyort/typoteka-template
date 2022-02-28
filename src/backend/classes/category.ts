import { Publication } from "../../types";

export class CategoryService {
  private _articles;
  constructor(articles: Publication[]) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((acc, item) => {
      item.category.forEach((category) => acc.add(category));
      return acc;
    }, new Set());

    return [...categories];
  }
}
