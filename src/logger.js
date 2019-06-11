import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'parser.log' }),
  ],
});

export default logger;
