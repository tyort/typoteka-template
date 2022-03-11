import { Router } from "express";
import { Publication } from "../../types";
import dayjs from "dayjs";
import { getAPI } from "../api";

const api = getAPI();
const myRouter = Router();

myRouter.get(`/`, async (req, res) => {
  const articles: Publication[] = await api.getArticles();
  const getFormatedDate = (createdDate: string, formatDate: string): string => {
    return dayjs(createdDate).format(formatDate);
  };

  res.render(`./publications/my-publications`, {articles, getFormatedDate});
});

myRouter.get(`/categories`, async (req, res) => {
  const categories: string[] = await api.getCategories();
  res.render(`all-categories`, {categories});
});

myRouter.get(`/comments`, async (req, res) => {
  const articles: Publication[] = await api.getArticles();
  const getFormatedDate = (createdDate: string, formatDate: string): string => {
    return dayjs(createdDate).format(formatDate);
  };

  res.render(`./publications/comments`, {articles, getFormatedDate});
});

export default myRouter;
