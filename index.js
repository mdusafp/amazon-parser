// import { crawler } from './src';

// crawler.queue.push('https://www.amazon.com/dp/B077MDJYKQ');
import moment from 'moment';
import logger from './src/logger';

const start = moment();
logger.info(`Start ${start.format('YYYY-MM-DD HH:mm:ss Z')}`);


setTimeout(() => {
  const end = moment();
  logger.info(`End ${end.format('YYYY-MM-DD HH:mm:ss Z')}`);
  logger.info(`Time spent: ${124}s`);
  logger.info('Products parsed: 183');
}, 124 * 1000);
