import { Router, Request } from "express";
import multer, { Multer, diskStorage, StorageEngine, DiskStorageOptions, FileFilterCallback } from "multer";
import path from "path";
import { getAPI } from "../api";
import { Publication } from "../../types";
import { nanoid } from "nanoid";
import { getFormatedDate } from "../../utils";

const api = getAPI();
const articlesRouter = Router();

const storage: StorageEngine = diskStorage(
  {
    destination: path.resolve(__dirname, `../upload/img/`),
    filename: (_req, file, cb) => {
      const uniqueName = nanoid(10);
      const extension = file.originalname.split(`.`).pop();
      cb(null, `${uniqueName}.${extension}`);
    }
  } as DiskStorageOptions
);

const fileFilter = ( _req: Request, _file: Express.Multer.File, callback: FileFilterCallback): void => {
  callback(null, true);
  // callback(new Error(`I don't have a clue!`)); Можно добавить свое условие при котором выбранный файл не будет принят
};

const multerInstance: Multer = multer({storage, fileFilter});

articlesRouter.get(`/category/:id`, (req, res) => res.send(`Говно ебаное`));

articlesRouter.get(`/add`, async (req, res) => {
  res.render(`publications/publication-empty`, {getFormatedDate});
});

articlesRouter.post(`/add`, multerInstance.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const getCategory = (choosenCategory: string | string[]) => {
    if (choosenCategory) {
      return Array.isArray(choosenCategory)
        ? choosenCategory
        : [choosenCategory];
    } else {
      return [`Разное`];
    }
  };

  const articleData = {
    picture: file ? file.filename : ``,
    announce: body.announcement,
    fullText: body[`full-text`],
    title: body[`title-text`],
    category: getCategory(body.category),
    createdDate: getFormatedDate(body.date, `YYYY-MM-DD HH:mm:ss`)
  };

  console.log(articleData);

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    console.log(error);
    res.redirect(`back`);
  }
});

articlesRouter.get(`/:id`, (req, res) => res.send(`Иди жопу нюхай`));

articlesRouter.get(`/edit/:articleId`, async (req, res) => {
  const {articleId} = req.params;
  const article: Publication = await api.getArticle(articleId);
  res.render(`publications/publication-edit`, {article, getFormatedDate});
});

export default articlesRouter;
