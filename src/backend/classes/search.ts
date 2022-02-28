import { Publication } from "../../types";

class SearchService {
  private _articles: Publication[];
  constructor(articles: Publication[]) {
    this._articles = articles;
  }

  findAll(searchText: string) {
    return this._articles
      .filter((article: Publication) => article.title.includes(searchText));
  }
}

export { SearchService };
