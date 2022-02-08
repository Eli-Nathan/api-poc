const { createLogger, format, transports } = require("winston");

const DD_API_KEY = process.env.DD_API_KEY;
const ENV = process.env.NODE_ENV;

const httpTransportOptions = {
  host: "http-intake.logs.datadoghq.com",
  path: `/api/v2/logs?dd-api-key=${DD_API_KEY}&ddsource=nodejs&service=nomadapp-api`,
  ssl: true,
};

const logger = createLogger({
  level: "info",
  exitOnError: false,
  format: format.json(),
  transports:
    ENV === "production"
      ? [new transports.Http(httpTransportOptions)]
      : [new transports.Console()],
});

module.exports = logger;
