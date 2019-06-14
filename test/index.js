import crawler from '../src/crawler';
import fs from 'fs';

// jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;

describe('puppeteer just work', () => {
  test('get image', () => {
    return crawler.crawl().then(() => {
      return expect(fs.existsSync('google.png')).toBe(true);
    });
  });
});