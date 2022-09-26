import express, { Express } from "express";
import request from "supertest";
import articles, { ReformedArticleAttributes } from "./articles";
import { ArticleService } from "../classes/article";
import { CommentService } from "../classes/comment";
import { HttpCode } from "../../const";
import { Response } from "superagent";
import { ArticleAttributes } from "../../types";
import { Sequelize } from "sequelize";
import initDb from "../library/init-db";
import defineModels from "../models";

const mockArticles = [
  {
    "picture": `mflrdmv.png`,
    "categories": [`Музыка`, `За жизнь`],
    "fullText": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Программировать не настолько сложно, как об этом говорят. Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?, Он написал больше 30 хитов. Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "title": `Обзор новейшего смартфона`,
    "comments": [
      {
        "text": `С чем связана продажа? Почему так дешёво? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "text": `Вы что?! В магазине дешевле. А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца.`
      }
    ]
  },
  {
    "picture": `ddhdcoemv.png`,
    "categories": [`Музыка`, `Без рамки`],
    "fullText": `Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Он написал больше 30 хитов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов.`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "title": `Рок — это протест`,
    "comments": [
      { "text": `Почему в таком ужасном состоянии?` },
      { "text": `А где блок питания? Совсем немного... Неплохо, но дорого.` },
      {
        "text": `Продаю в связи с переездом. Отрываю от сердца. Неплохо, но дорого. Почему в таком ужасном состоянии?`
      },
      { "text": `Почему в таком ужасном состоянии?` }
    ]
  },
  {
    "picture": `mfcnehvf.png`,
    "categories": [`Музыка`],
    "fullText": ``,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "title": `Как начать программировать`,
    "comments": [{ "text": `Совсем немного... Вы что?! В магазине дешевле. Неплохо, но дорого.` }]
  },
  {
    "picture": `mcnr474hf.png`,
    "categories": [`Железо`, `Деревья`],
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?, Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Это один из лучших рок-музыкантов. Как начать действовать? Для начала просто соберитесь.`,
    "announce": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Он написал больше 30 хитов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "title": `Лучшие рок-музыканты 20-века`,
    "comments": [
      { "text": `Почему в таком ужасном состоянии? Совсем немного... Вы что?! В магазине дешевле.` },
      { "text": `С чем связана продажа? Почему так дешёво?` },
      { "text": `Совсем немного...` }
    ]
  },
  {
    "picture": `vmnrjf8j3.png`,
    "categories": [`Программирование`],
    "fullText": `Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Достичь успеха помогут ежедневные повторения.`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?, Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "title": `Как достигнуть успеха не вставая с кресла`,
    "comments": [
      {
        "text": `Вы что?! В магазине дешевле. А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "text": `Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту? Неплохо, но дорого.`
      },
      { "text": `А сколько игр в комплекте?` }
    ]
  },
  {
    "picture": `dncjdnd.png`,
    "categories": [`Железо`],
    "fullText": `Из под его пера вышло 8 платиновых альбомов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Достичь успеха помогут ежедневные повторения. Как начать действовать? Для начала просто соберитесь. Золотое сечение — соотношение двух величин, гармоническая пропорция. Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина. Программировать не настолько сложно, как об этом говорят. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    "announce": `Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко, если вы прирожденный герой. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "title": `Что такое золотое сечение`,
    "comments": [
      { "text": `С чем связана продажа? Почему так дешёво? Совсем немного... А где блок питания?` },
      {
        "text": `Продаю в связи с переездом. Отрываю от сердца. А где блок питания? С чем связана продажа? Почему так дешёво?`
      }
    ]
  },
  {
    "picture": `md7dhcu9.png`,
    "categories": [`IT`],
    "fullText": `Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Программировать не настолько сложно, как об этом говорят. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Ёлки — это не просто красивое дерево. Это прочная древесина. Золотое сечение — соотношение двух величин, гармоническая пропорция. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?,`,
    "announce": `Это один из лучших рок-музыкантов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "title": `Лучшие рок-музыканты 20-века`,
    "comments": [
      {
        "text": `Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле.`
      }
    ]
  },
  {
    "picture": `mc8dhs4g.png`,
    "categories": [`Музыка`, `Железо`],
    "fullText": `Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "announce": `Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "title": `Самый лучший музыкальный альбом этого года`,
    "comments": [{ "text": `Совсем немного...` }]
  }
];

const mockCategories = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

const createAPI = async (): Promise<Express> => {
  // Тестовая база данных sqlite. Она будет храниться в оперативной памяти.
  // Логирование запросов отключили. Асинхронные операции вынесли в beforeAll.
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDb(mockDB, {categories: mockCategories, articles: mockArticles});
  const app = express();
  app.use(express.json());
  const definedModels = defineModels(mockDB);
  articles(app, new ArticleService(mockDB, definedModels), new CommentService(definedModels));
  return app;
};

describe(`API returns a list of all articles`, () => {
  let response: Response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles?needComments=true`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 8 articles`, () => expect(response.body.length).toBe(8));
  test(`Article with id=1 has the attributes: id, categories, comments, updatedAt, createdAt`, () => {
    const firstArticle = response.body.find((article: ReformedArticleAttributes) => article.id === 1);
    expect(firstArticle).toMatchObject({
      ...mockArticles[0],
      id: 1,
      categories: expect.anything(),
      comments: expect.anything(),
      updatedAt: expect.anything(),
      createdAt: expect.anything()
    });
  });
});

describe(`API creates an article if data is valid`, () => {
  let response: Response;
  let app: Express;

  const newArticle: ArticleAttributes = {
    picture: ``,
    announce: `Ну не знаю что это... может, для мужиков`,
    title: `Какая-то резиновая штука`,
    fullText: ``,
    categories: [1, 2],
  };

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle); // отправляем на бэкэнд в req.body
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`New article created with new attributes: id, updatedAt, createdAt. But without "categories" attribute`, () => {
    expect(response.body).toMatchObject({
      id: 9,
      picture: ``,
      announce: `Ну не знаю что это... может, для мужиков`,
      title: `Какая-то резиновая штука`,
      fullText: ``,
      updatedAt: expect.anything(),
      createdAt: expect.anything()
    });
  });
  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(9))
  );
});

describe(`API returns an article with given id`, () => {
  let response: Response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/2`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article's title is "Рок — это протест"`, () => expect(response.body.title).toBe(`Рок — это протест`));
});

describe(`API returns a message with non-existent id`, () => {
  let response: Response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/100000`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Mesage on screen: "Not found article with 100000"`, () => expect(response.text)
    .toBe(`Not found article with 100000`));
});

describe(`API changes existent article`, () => {
  const updatedArticle: ArticleAttributes = {
    picture: `fkfj4mfj.png`,
    announce: `Ну не знаю что это... может, для мужиков`,
    title: `Какая-то резиновая штука`,
    fullText: `Большая и гладкая штуковина, похожая на огурец`,
    categories: [3, 4],
  };

  let app: Express;
  let response: Response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/3`)
      .send(updatedArticle); // отправляем на бэкэнд в req.body
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article is really changed`, () => request(app)
    .get(`/articles/3?needComments=true`)
    .expect((res) => {
      expect(res.body).toMatchObject({
        ...updatedArticle,
        id: 3,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        categories: expect.anything(),
        comments: expect.anything()
      });
    })
  );
});

describe(`API tries to change non-existent article`, () => {
  const updatedArticle: ArticleAttributes = {
    picture: `fkfj4mfj.png`,
    announce: `Ну не знаю что это... может, для мужиков`,
    title: `Какая-то резиновая штука`,
    fullText: `Большая и гладкая штуковина, похожая на огурец`,
    categories: [3, 4],
  };

  let app: Express;
  let response: Response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/333333333`)
      .send(updatedArticle); // отправляем на бэкэнд в req.body
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Mesage on screen: "Not found article with 333333333"`, () => expect(response.text)
    .toBe(`Not found article with 333333333`));
});

describe(`API correctly deletes an article`, () => {
  let response: Response;
  let app: Express;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/3`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article with id=3 was deleted`, () => expect(response.text)
    .toBe(`Article with id=3 was deleted`));
  test(`There are 7 articles now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(7))
  );
});

describe(`API refuses to delete non-existent article`, () => {
  let response: Response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .delete(`/articles/3333333333`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Mesage on screen: "Not found article with 3333333333"`, () => expect(response.text)
    .toBe(`Not found article with 3333333333`));
});

describe(`API returns a choosen article's list of comments`, () => {
  let response: Response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/3/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 1 comment`, () => expect(response.body.length).toBe(1));
  test(`Сomment has articleId=3`, () => expect(response.body[0].articleId).toBe(3));
});

describe(`API doesn't return non-existent article's list of comments`, () => {
  let response: Response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/3333333333/comments`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Mesage on screen: "Article with id=3333333333 not found"`, () => expect(response.text)
    .toBe(`Article with id=3333333333 not found`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  let app: Express;
  let response: Response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles/3/comments`)
      .send(newComment); // отправляем на бэкэнд в req.body
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`New comment was created`, () => expect(response.body).toMatchObject({
    id: expect.anything(),
    text: `Валидному комментарию достаточно этого поля`,
    updatedAt: expect.anything(),
    createdAt: expect.anything(),
    articleId: 3
  }));
  test(`Comments count is changed`, () => request(app)
    .get(`/articles/3/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

describe(`API doesn't create a comment if article doesn't exist`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  let app: Express;
  let response: Response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles/3333333333/comments`)
      .send(newComment); // отправляем на бэкэнд в req.body
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Mesage on screen: "Article with id=3333333333 not found"`, () => expect(response.text)
    .toBe(`Article with id=3333333333 not found`));
});

describe(`API doesn't create a comment if comment's data is invalid`, () => {
  const newComment = {
    text: ``
  };
  let response: Response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .post(`/articles/3/comments`)
      .send(newComment); // отправляем на бэкэнд в req.body
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
  test(`Mesage on screen: "Comment data is invalid"`, () => expect(response.text)
    .toBe(`Comment data is invalid`));
});

describe(`API correctly deletes a comment`, () => {
  let app: Express;
  let response: Response;
  let res: Response;

  beforeAll(async () => {
    app = await createAPI();
    res = await request(app)
      .get(`/articles/3/comments`);
    response = await request(app)
      .delete(`/articles/3/comments/${res.body[0].id}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns text if comment was deleted successfully`, () => {
    expect(response.text).toBe(`Comment with id:${res.body[0].id} was deleted`);
  });
  test(`Comments count is 0 now`, () => request(app)
    .get(`/articles/3/comments`)
    .expect((answer) => expect(answer.body.length).toBe(0))
  );
});

describe(`API refuses to delete non-existent comment`, () => {
  let app: Express;
  let response: Response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/3/comments/3333333333`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Mesage on screen: "Comment with id:3333333333 isn't founded"`, () => expect(response.text)
    .toBe(`Comment with id:3333333333 isn't founded`));
});

describe(`API refuses to delete a comment in non-existent article`, () => {
  let app: Express;
  let response: Response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/3333333333/comments/lololo`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Mesage on screen: "Article with id=3333333333 not found"`, () => expect(response.text)
    .toBe(`Article with id=3333333333 not found`));
});
