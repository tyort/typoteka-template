import { Router } from "express";
const myRouter = Router();

myRouter.get(`/`, (req, res) => res.send(`Иди жопу нюхай`));
myRouter.get(`/categories`, (req, res) => res.send(`Говно ебаное`));
myRouter.get(`/comments`, (req, res) => res.send(`Жри сука`));

export default myRouter;
