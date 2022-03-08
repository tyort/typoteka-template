import pino from "pino";

export const logger = pino({
  name: `base-logger`,
  level: `debug`,
});

// Метод всегда возвращает новый логгер, унаследованный от стандартного логгера.
// В метод можно передать специфичные настройки для нового экземпляра класса.
export const getLogger = (options = {}) => logger.child(options);
