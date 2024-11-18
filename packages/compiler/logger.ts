import { pino } from "pino";

export const logger = pino(
  {
    level:
      process.env["NODE_ENV"] === "development" ||
      process.env["NODE_ENV"] === "test"
        ? "debug"
        : "info",
  },
  pino["destination"] ? pino.destination(2) : undefined,
);
