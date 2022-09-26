import pino from "pino";

// ????? Почему путь работает относительно корневой папки
const LOG_FILE = `./logs/api.log`;

const onPinoPretty = {
  target: `pino-pretty`,
  options: {
    colorize: true
  }
};

export const logger = pino({
  name: `base-logger`,
  level: process.env.NODE_ENV_DEV ? `debug` : `info`,
  transport: process.env.NODE_ENV_DEV ? onPinoPretty : undefined,
}, process.env.NODE_ENV_DEV ? process.stdout : pino.destination(LOG_FILE));

// Метод всегда возвращает новый логгер, унаследованный от стандартного логгера.
// В метод можно передать специфичные настройки для нового экземпляра класса.
export const getLogger = (options = {}) => logger.child(options);
