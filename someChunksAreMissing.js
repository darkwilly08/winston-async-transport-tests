import { createLogger } from "winston";
import { AsyncStreamWinston } from "./asyncStreamWinston.js";

const logger = createLogger({
  level: "info",
  transports: [ new AsyncStreamWinston()],
});

/**
 * The last chunk multiple of the highWaterMark value is missing
 * Assuming that highWaterMark is 16, the logs will be grouped on 16, 32, 48, 64, etc. The log number 65 will be missing. 
 * On the other hand, if I increase the loop to 82 (or 83, 84, ... 96), any log above #64 will be missing.
 * 
 * note: highWaterMark default value for objectMode is 16
 */
for (let index = 1; index <= 65; index++) {
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

