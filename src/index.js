import chalk from 'chalk';
import lodash from 'lodash';
import Promise from 'bluebird';
import crawler from './crawler';
import logger from './logger';
import { Product } from './database';

async function main() {
  const products = await crawler.crawl();
  const chunks = lodash.chunk(products, 100);
  try {
    await Promise.map(chunks, chunk => Product.insertMany(chunk));
  } catch (err) {
    logger.error(chalk.red(JSON.stringify(err, null, 2)));
  }
}

main();
