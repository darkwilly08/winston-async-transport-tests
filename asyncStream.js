import { Writable } from "stream";

export class AsyncStream extends Writable {
  constructor(opts) {
    super({
      objectMode: true,
      ...opts,
    });

    this.callsInProgress = new Map();
    this.index = 0;

    this.name = "async-transport";
  }

  async _final(callback) {
    console.log("final", this.callsInProgress.size);
    await Promise.all(this.callsInProgress.values());
    callback();
  }

  _write(chunk, _, callback) {
    const i = this.index++;
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        console.log("logg:: result", chunk.toString());
        resolve();
      }, 1000);
    });

    this.callsInProgress.set(
      i,
      promise.finally(() => {
        console.count("logged");
        this.callsInProgress.delete(i);
      })
    );

    setImmediate(() => {
      callback();
    });
  }

  log(chunk, callback = () => {}) {
    return this.write(chunk, null, callback);
  }

  async waitPendingAndFinish() {
    const promise = new Promise((resolve, reject) => {
      this.on("finish", () => {
        resolve();
      });
      this.on("error", (err) => {
        reject(err);
      });
    });
    this.end();

    return promise;
  }
}
