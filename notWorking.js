import { createLogger, transports } from "winston";
import { AsyncTransport } from "./asyncLogger.js";

const logger = createLogger({
  level: "info",
  transports: [ new AsyncTransport(), new transports.Console()],
});

/**
 * In order to make it work, the loop must be less than 16. In other words, the loop must be less than highWaterMark value.
 * As alternative, I can remove the setImmediate from the AsyncTransport class and call callback directly.
 */
for (let index = 1; index <= 500; index++) {
  logger.info(`count: ${index}`);
}


const finish = () => {
  console.log("finish");
  const promise = new Promise((resolve) => {
    logger.on("finish", () => {
      console.log("logger finish");
      resolve();
    });
  });
  logger.end();
  return promise;
};

await finish();

process.exit(0);
