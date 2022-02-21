import { Router } from "express";
const mainRouter = Router();

mainRouter.get(`/`, (req, res) => res.send(`main`));
mainRouter.get(`/register`, (req, res) => res.send(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.send(`login`));
mainRouter.get(`/search`, (req, res) => res.send(`search-result`));

export default mainRouter;
