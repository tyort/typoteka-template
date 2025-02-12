import dayjs from "dayjs";

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateDateByMs = () => {
  const milliseconds = getRandomInt(1443903114233, 1643903114233);
  return new Date(milliseconds);
};

export const getFormatedDate = (createdDate: string, formatDate: string): string => {
  return dayjs(createdDate).format(formatDate);
};

export const getShuffledArray = (someArray: string[]) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

export const getRandomSubarray = (items: string[]) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        // Удаляет "1" элемент из массива по индексу "getRandomInt(0, items.length - 1)"
        ...items.splice(getRandomInt(0, items.length - 1), 1)
    );
  }
  return result;
};
