import { AsyncStream } from "./asyncStream.js";

const asyncStream = new AsyncStream();

for (let index = 0; index < 20000; index++) {
  asyncStream.log(`count: ${index}`);
}

await asyncStream.waitPendingAndFinish();

process.exit(0);
