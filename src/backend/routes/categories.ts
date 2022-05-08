import { Router } from "express";
import { HttpCode } from "../../const";
import { CategoryService } from "../classes";

const route = Router();

export default (app: Router, service: CategoryService) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {needCount} = req.query; // ??????
    const categories = await service.findAll(!!needCount);
    res
      .status(HttpCode.OK)
      .json(categories);
  });
};
