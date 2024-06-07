import { logger } from "./init.js";
import { AsyncStream } from "./asyncStream.js";

const asyncStream = new AsyncStream();

for (let index = 0; index < 200; index++) {
  asyncStream.log(`count: ${index}`);
}

const finish = () => {
  console.log("finish");
  const promise = new Promise((resolve) => {
    asyncStream.on("finish", () => {
      console.log("logger finish");
      resolve();
    });
  });
  asyncStream.end();
  return promise;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await sleep(100);

await finish();

process.exit(0);
