import { Router } from "express";
const articlesRouter = Router();

articlesRouter.get(`/:id`, (req, res) => res.send(`Иди жопу нюхай`));
articlesRouter.get(`/category/:id`, (req, res) => res.send(`Говно ебаное`));
articlesRouter.get(`/add`, (req, res) => res.send(`Жри сука`));
articlesRouter.get(`/edit/:id`, (req, res) => res.send(`На на на на`));

export default articlesRouter;
