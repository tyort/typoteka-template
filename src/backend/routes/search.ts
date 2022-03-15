import { Router } from "express";
import { HttpCode } from "../../const";
import { SearchService } from "../classes";

const route = Router();

export default (app: Router, service: SearchService) => {
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {title = ``} = req.query;

    if (title) {
      const searchResults = service.findAll(title as string);
      const searchStatus = searchResults.length > 0
        ? HttpCode.OK
        : HttpCode.NOT_FOUND;

      res
        .status(searchStatus)
        .json(searchResults);

    } else {
      res
        .status(HttpCode.BAD_REQUEST)
        .json([]);
    }
  });
};
