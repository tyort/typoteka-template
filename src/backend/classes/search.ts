import { Publication } from "../../types";

class SearchService {
  private _articles: Publication[];
  constructor(articles: Publication[]) {
    this._articles = articles;
  }

  findAll(searchText: string) {
    const enteredText = new RegExp(`${searchText}`, `i`);
    return this._articles
      .filter((article: Publication) => article.title.match(enteredText));
  }
}

export { SearchService };
