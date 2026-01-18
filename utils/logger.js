/**
 * Logger utility for consistent logging across the bot
 */
const LOG_LEVELS = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

const LOG_LEVEL_VALUES = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const currentLogLevel =
  LOG_LEVEL_VALUES[process.env.LOG_LEVEL?.toUpperCase() || "INFO"];

/**
 * Format timestamp for logs
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Log message with level
 */
function log(level, message, data = null) {
  if (LOG_LEVEL_VALUES[level] > currentLogLevel) return;

  const timestamp = getTimestamp();
  const prefix = `[${timestamp}] [${level}]`;

  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

module.exports = {
  error: (msg, data) => log(LOG_LEVELS.ERROR, msg, data),
  warn: (msg, data) => log(LOG_LEVELS.WARN, msg, data),
  info: (msg, data) => log(LOG_LEVELS.INFO, msg, data),
  debug: (msg, data) => log(LOG_LEVELS.DEBUG, msg, data),
};
