import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Publication } from "../types";
const { create } = axios;

const TIMEOUT = 1000;
const PORT = 3005;
const URL = `http://localhost:${PORT}/api/`;

export class API {
  private _http: AxiosInstance;

  constructor(baseURL: string, timeout: number) {
    this._http = create({
      baseURL,
      timeout
    });
  }

  async _load(url: string, options: AxiosRequestConfig = {}) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles() {
    return this._load(`/articles`);
  }

  getArticle(id: string) {
    return this._load(`/articles/${id}`);
  }

  search(query: string) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories() {
    return this._load(`/categories`);
  }

  createArticle(data: Omit<Publication, `id` | `comments`>) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }
}

export const getAPI = () => new API(URL, TIMEOUT);
