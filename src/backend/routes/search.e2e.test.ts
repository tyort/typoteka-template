import express from "express";
import request from "supertest";
import search from "./search";
import { SearchService } from "../classes/search";
import { HttpCode } from "../../const";
import { Response } from "superagent";
import initDb from "../library/init-db";
import { Sequelize } from "sequelize";

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

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDb(mockDB, {categories: mockCategories, articles: mockArticles});
  search(app, new SearchService(mockDB));
});

describe(`API returns Article based on search query`, () => {
  let response: Response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        title: `Рограм` // Сработал также `как`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 article found`, () => expect(response.body.length).toBe(1));
});

test(`API returns code 404 if nothing is found`,
    () => request(app)
      .get(`/search`)
      .query({
        title: `Продам свою душу`
      })
      .expect(HttpCode.NOT_FOUND)
);

test(`API returns 400 when query string is absent`,
    () => request(app)
      .get(`/search?turtle=qweqwe`)
      .expect(HttpCode.BAD_REQUEST)
);
