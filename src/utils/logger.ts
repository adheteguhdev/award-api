import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import config from '../config';

const DailyRotateFile = require('winston-daily-rotate-file');
const {
  combine,
  prettyPrint,
  timestamp,
  colorize,
  simple,
  printf,
  json,
} = format;
const logDir = config.log.dir;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const fromatConsole = printf(({ level, message, timestamp }) => {
  return `${timestamp} - ${level}: ${message}`;
});

const consoleTransport = new transports.Console({
  handleExceptions: true,
  format: combine(prettyPrint(), colorize(), simple(), fromatConsole),
});

const fileTransport = new DailyRotateFile({
  filename: 'award-api-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  dirname: logDir,
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '7d',
  handleExceptions: true,
  json: true,
});

const logger = createLogger({
  level: config.log.level,
  format: combine(timestamp(), json()),
  transports: [fileTransport, consoleTransport],
  exitOnError: false,
});

export default logger;
