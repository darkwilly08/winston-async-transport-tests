import { createLogger, format } from "winston";
// import { AsyncTransport } from "./asyncLogger.js";
import { AsyncStreamWinston } from "./asyncStreamWinston.js";
import { AsyncTransport } from "./asyncLoggerOverride.js";

export const logger = createLogger({
  level: "info",
  format: format.json(),
  transports: [ new AsyncTransport()],
});
