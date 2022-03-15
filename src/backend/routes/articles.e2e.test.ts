import express, { json, Express } from "express";
import request from "supertest";
import articles from "./articles";
import { ArticleService } from "../classes/article";
import { CommentService } from "../classes/comment";
import { HttpCode } from "../../const";
import { Response } from "superagent";
import { Publication } from "../../types";

const mockData = [
  {
    "id": `EDKR0y`,
    "picture": `mflrdmv.png`,
    "category": [`Музыка`],
    "fullText": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Программировать не настолько сложно, как об этом говорят. Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?, Он написал больше 30 хитов. Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "createdDate": `2016-12-01 06:14:05`,
    "title": `Обзор новейшего смартфона`,
    "comments": [
      {
        "id": `RMTkPT`,
        "text": `С чем связана продажа? Почему так дешёво? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `nrAKeu`,
        "text": `Вы что?! В магазине дешевле. А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца.`
      }
    ]
  },
  {
    "id": `hJVVAg`,
    "picture": `ddhdcoemv.png`,
    "category": [`Музыка`],
    "fullText": `Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Он написал больше 30 хитов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов.`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "createdDate": `2020-03-15 23:35:35`,
    "title": `Рок — это протест`,
    "comments": [
      { "id": `shh08i`, "text": `Почему в таком ужасном состоянии?` },
      { "id": `1xfuWA`, "text": `А где блок питания? Совсем немного... Неплохо, но дорого.` },
      {
        "id": `h14SBi`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. Неплохо, но дорого. Почему в таком ужасном состоянии?`
      },
      { "id": `PLufPe`, "text": `Почему в таком ужасном состоянии?` }
    ]
  },
  {
    "id": `EahC2j`,
    "picture": `mfcnehvf.png`,
    "category": [`Музыка`],
    "fullText": ``,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "createdDate": `2017-05-20 19:55:09`,
    "title": `Как начать программировать`,
    "comments": [{ "id": `T7JTKR`, "text": `Совсем немного... Вы что?! В магазине дешевле. Неплохо, но дорого.` }]
  },
  {
    "id": `NcfAyH`,
    "picture": `mcnr474hf.png`,
    "category": [`Железо`],
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?, Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Это один из лучших рок-музыкантов. Как начать действовать? Для начала просто соберитесь.`,
    "announce": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Он написал больше 30 хитов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "createdDate": `2016-08-05 13:41:38`,
    "title": `Лучшие рок-музыканты 20-века`,
    "comments": [
      { "id": `qGowUz`, "text": `Почему в таком ужасном состоянии? Совсем немного... Вы что?! В магазине дешевле.` },
      { "id": `0k0HgF`, "text": `С чем связана продажа? Почему так дешёво?` },
      { "id": `cIkLdD`, "text": `Совсем немного...` }
    ]
  },
  {
    "id": `hB9sCA`,
    "picture": `vmnrjf8j3.png`,
    "category": [`Программирование`],
    "fullText": `Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Достичь успеха помогут ежедневные повторения.`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?, Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "createdDate": `2019-11-25 10:57:18`,
    "title": `Как достигнуть успеха не вставая с кресла`,
    "comments": [
      {
        "id": `K031Cw`,
        "text": `Вы что?! В магазине дешевле. А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `jNDixh`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту? Неплохо, но дорого.`
      },
      { "id": `mwnWsE`, "text": `А сколько игр в комплекте?` }
    ]
  },
  {
    "id": `N-tO53`,
    "picture": `dncjdnd.png`,
    "category": [`Железо`],
    "fullText": `Из под его пера вышло 8 платиновых альбомов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Достичь успеха помогут ежедневные повторения. Как начать действовать? Для начала просто соберитесь. Золотое сечение — соотношение двух величин, гармоническая пропорция. Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина. Программировать не настолько сложно, как об этом говорят. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    "announce": `Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко, если вы прирожденный герой. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "createdDate": `2018-11-01 14:57:21`,
    "title": `Что такое золотое сечение`,
    "comments": [
      { "id": `Dlmwz6`, "text": `С чем связана продажа? Почему так дешёво? Совсем немного... А где блок питания?` },
      {
        "id": `V8_vFd`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. А где блок питания? С чем связана продажа? Почему так дешёво?`
      }
    ]
  },
  {
    "id": `c5pkOb`,
    "picture": `md7dhcu9.png`,
    "category": [`IT`],
    "fullText": `Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Программировать не настолько сложно, как об этом говорят. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Ёлки — это не просто красивое дерево. Это прочная древесина. Золотое сечение — соотношение двух величин, гармоническая пропорция. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?,`,
    "announce": `Это один из лучших рок-музыкантов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "createdDate": `2021-05-26 12:07:03`,
    "title": `Лучшие рок-музыканты 20-века`,
    "comments": [
      {
        "id": `t755ME`,
        "text": `Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле.`
      }
    ]
  },
  {
    "id": `dTqr-c`,
    "picture": `mc8dhs4g.png`,
    "category": [`Музыка`],
    "fullText": `Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "announce": `Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "createdDate": `2021-03-19 01:15:26`,
    "title": `Самый лучший музыкальный альбом этого года`,
    "comments": [{ "id": `KE3Xy2`, "text": `Совсем немного...` }]
  }
];

const createAPI = (): Express => {
  const app = express();
  const cloneData: Publication[] = JSON.parse(JSON.stringify(mockData));
  app.use(json());
  articles(app, new ArticleService(cloneData), new CommentService());
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 8 articles`, () => expect(response.body.length).toBe(8));
  test(`First article's id equals "EDKR0y"`, () => expect(response.body[0].id).toBe(`EDKR0y`));
});

describe(`API creates an article if data is valid`, () => {
  const newOffer: Omit<Publication, `id` | `comments`> = {
    picture: `sdflfk.png`,
    announce: `Ну не знаю что это... может, для мужиков`,
    title: `Какая-то резиновая штука`,
    fullText: `Большая и гладкая штуковина, похожая на огурец`,
    createdDate: `2016-12-01 06:14:05`,
    category: [`Игрушки для взрослых`],
  };

  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`New article contains properties: id, comments`, () => {
    expect(response.body).toHaveProperty(`id`);
    expect(response.body).toHaveProperty(`comments`, []);
  });
  test(`New article created with all properties`, () => expect(response.body)
    .toMatchObject({...newOffer, id: response.body.id, comments: []})
  );
  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(9))
  );
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/hJVVAg`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Рок — это протест"`, () => expect(response.body.title).toBe(`Рок — это протест`));
});

describe(`API returns a message with non-existent id`, () => {
  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/lalalala`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Mesage on screen: "Not found article with lalalala"`, () => expect(response.text)
    .toBe(`Not found article with lalalala`));
});

describe(`API changes existent article`, () => {
  const updatedArticle: Omit<Publication, `id` | `comments`> = {
    picture: `fkfj4mfj.png`,
    announce: `Ну не знаю что это... может, для мужиков`,
    title: `Какая-то резиновая штука`,
    fullText: `Большая и гладкая штуковина, похожая на огурец`,
    createdDate: `2016-12-01 06:14:05`,
    category: [`Игрушки для взрослых`],
  };

  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/NcfAyH`)
      .send(updatedArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article is really changed`, () => request(app)
    .get(`/articles/NcfAyH`)
    .expect((res) => expect(res.body.title).toBe(`Какая-то резиновая штука`))
  );
  test(`Updated article contains properties: id, comments`, () => {
    expect(response.body).toHaveProperty(`id`, `NcfAyH`);
    expect(response.body).toHaveProperty(`comments`, [
      { "id": `qGowUz`, "text": `Почему в таком ужасном состоянии? Совсем немного... Вы что?! В магазине дешевле.` },
      { "id": `0k0HgF`, "text": `С чем связана продажа? Почему так дешёво?` },
      { "id": `cIkLdD`, "text": `Совсем немного...` }
    ]);
  });
});

describe(`API tries to change non-existent article`, () => {
  const updatedArticle: Omit<Publication, `id` | `comments`> = {
    picture: `djrjnv346.png`,
    announce: `Ну не знаю что это... может, для мужиков`,
    title: `Какая-то резиновая штука`,
    fullText: `Большая и гладкая штуковина, похожая на огурец`,
    createdDate: `2016-12-01 06:14:05`,
    category: [`Игрушки для взрослых`],
  };

  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/lalalala`)
      .send(updatedArticle);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Mesage on screen: "Not found article with lalalala"`, () => expect(response.text)
    .toBe(`Not found article with lalalala`));
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/hJVVAg`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted article`, () => expect(response.body.id).toBe(`hJVVAg`));
  test(`There are 7 articles now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(7))
  );
});

describe(`API refuses to delete non-existent article`, () => {
  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/lalalala`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Mesage on screen: "Not found article with lalalala"`, () => expect(response.text)
    .toBe(`Not found article with lalalala`));
});

describe(`API returns a choosen article's list of comments`, () => {
  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/EDKR0y/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 comments`, () => expect(response.body.length).toBe(2));
  test(`First comment's id is "RMTkPT"`, () => expect(response.body[0].id).toBe(`RMTkPT`));
});

describe(`API doesn't return non-existent article's list of comments`, () => {
  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/lalalala/comments`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Mesage on screen: "Article with id=lalalala not found"`, () => expect(response.text)
    .toBe(`Article with id=lalalala not found`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/EDKR0y/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Added comment contains property: id`, () => expect(response.body).toHaveProperty(`id`));
  test(`Comments count is changed`, () => request(app)
    .get(`/articles/EDKR0y/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

describe(`API doesn't create a comment if article doesn't exist`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/lalalala/comments`)
      .send(newComment);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Mesage on screen: "Article with id=lalalala not found"`, () => expect(response.text)
    .toBe(`Article with id=lalalala not found`));
});

describe(`API doesn't create a comment if comment's data is invalid`, () => {
  const newComment = {
    text: ``
  };
  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/EDKR0y/comments`)
      .send(newComment);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
  test(`Mesage on screen: "Comment data is invalid"`, () => expect(response.text)
    .toBe(`Comment data is invalid`));
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/EDKR0y/comments/RMTkPT`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`RMTkPT`));
  test(`Comments count is 1 now`, () => request(app)
    .get(`/articles/EDKR0y/comments`)
    .expect((res) => expect(res.body.length).toBe(1))
  );
});

describe(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/EDKR0y/comments/lalalala`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Mesage on screen: "Comment with id:lalalala isn't founded"`, () => expect(response.text)
    .toBe(`Comment with id:lalalala isn't founded`));
});

describe(`API refuses to delete a comment in non-existent article`, () => {
  const app = createAPI();
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/lalalala/comments/lololo`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Mesage on screen: "Article with id=lalalala not found"`, () => expect(response.text)
    .toBe(`Article with id=lalalala not found`));
});
