import dotenv from 'dotenv';
import chalk from 'chalk';
import moment from 'moment';

import logger from './logger';
import Crawler from './crawler';
import { connect, disconnect } from './database';

import httpProvider from './http-provider';

dotenv.config();

async function main() {
  const start = moment();
  logger.info(chalk.blue(`Script started at ${start.format('YYYY-MM-DD HH:mm:ss Z')}`));
  await connect();
  const crawler = new Crawler(httpProvider);

  let products = [];
  try {
    products = await crawler.crawl('tv');
    await disconnect();
  } catch (err) {
    logger.error(chalk.red(JSON.stringify(err, null, 2)));
    await disconnect();
  }

  const end = moment();
  const diff = moment.duration(end.diff(start));
  const hh = Math.floor(diff.asHours());
  const mm = Math.floor(diff.asMinutes() - hh * 60);
  const ss = Math.floor(diff.asSeconds() - hh * 60 * 60 - mm * 60);
  logger.info(chalk.blue(`Script ended at ${end.format('YYYY-MM-DD HH:mm:ss Z')}`));
  logger.info(chalk.blue(`Total time: ${hh}:${mm}:${ss}`));
  logger.info(chalk.blue(`products length: ${products.length}`));
}

main();

process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled rejection (promise: ${promise}, reason: ${err}.`);
});
