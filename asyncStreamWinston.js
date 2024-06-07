import { Writable } from "stream";

export class AsyncStreamWinston extends Writable {
  constructor(opts) {
    super({
      objectMode: true,
      ...opts,
    });

    this.callsInProgress = new Map();
    this.index = 0;

    this.name = "async-transport";

    this.on("drain", () => {
      console.log("drain", this.index);
    });
  }

  async _final(callback) {
    console.log("final", this.callsInProgress.size);
    await Promise.all(this.callsInProgress.values());
    callback();
  }

  _write({ message }, _, callback) {
    const i = this.index++;
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        // console.log("logg:: result", message);
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

    // It works but the last chunk is missing
      setImmediate(() => {
        callback();
      });
      // callback();
  }

  log(data, callback = () => {}) {
    this.write(data, encoding, callback);

  }

  // log(chunk, callback = () => {}) {
  //   this.write(chunk, null, callback);
  // }
}
