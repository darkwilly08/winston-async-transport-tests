import Transport from "winston-transport";

export class AsyncTransport extends Transport {
  constructor(opts) {
    super({
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

  log({ message }, callback) {
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

    // Removing setImmediate or increasing highWaterMark will make it work
    setImmediate(() => {
      callback();
    });
  }
}
