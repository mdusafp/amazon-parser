import chalk from 'chalk';
import lodash from 'lodash';
import Promise from 'bluebird';
import querystring from 'query-string';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import logger from './logger';

const options = {
  search: 'headphones',
  launch: { headless: true },
  maxPage: 20,
  transform: body => cheerio.load(body),
  setViewport: { width: 1240, height: 680 },
};

const baseUrl = 'https://amazon.com';

const getSearchUrl = (topic, pageNumber) => {
  const params = {
    k: topic,
    page: pageNumber,
    ref: `sr_pg_${pageNumber}`,
  };
  return `${baseUrl}/s?${querystring.stringify(params)}`;
};

const getReviewsUrl = relativeUrl => `${baseUrl}${relativeUrl}`;

async function search(page, text) {
  const SEARCHBOX_SELECTOR = '#nav-search .nav-search-field .nav-input';
  const BUTTON_SELECTOR = '#nav-search .nav-search-submit .nav-input';

  await page.goto(baseUrl, { waitUntil: ['domcontentloaded'] });
  await page.click(SEARCHBOX_SELECTOR);
  await page.keyboard.type(text);
  await page.click(BUTTON_SELECTOR);
  await page.waitForNavigation();
}

async function getTotalPages(page) {
  const NEXT_SELECTOR = 'ul.a-pagination li.a-last';
  const content = await page.content();
  const $ = options.transform(content);
  // get next button and take prev sibling
  const total = parseInt($(NEXT_SELECTOR).prev().text(), 10);
  return total || options.maxPage;
}

function times(callback) {
  const value = this.valueOf();

  if (typeof callback !== 'function') {
    throw new TypeError();
  }
  if (lodash.isNaN(parseInt(Number(value), 10))) {
    throw new TypeError('Object is not a valid number');
  }

  const arr = Array.from({ length: value }, (v, k) => k);

  return Promise.mapSeries(arr, callback);
}

// eslint-disable-next-line no-extend-native
String.prototype.times = times;
// eslint-disable-next-line no-extend-native
Number.prototype.times = times;

async function parseProducts(topic, page, index) {
  const PRODUCT_SELECTOR = '.sg-row.s-result-list.s-search-results > .s-result-item';
  const PRODUCT_LINK_SELECTOR = '.a-link-normal.a-text-normal';
  const PRODUCT_TITLE_SELECTOR = 'h2 span.a-color-base.a-text-normal';
  const PRODUCT_RATE_SELECTOR = '.a-icon.a-icon-star-small.a-star-small-4-5.aok-align-bottom';
  const PRODUCT_PRICE_SELECTOR = '.a-price > .a-offscreen';
  const PRODUCT_AUTHOR_SELECTOR = '#bylineInfo';

  const url = getSearchUrl(topic, index);
  await page.goto(url, { waitUntil: ['domcontentloaded'] });

  const content = await page.content();
  const $ = options.transform(content);

  return lodash.map($(PRODUCT_SELECTOR), product => ({
    topic,
    url: $(product).find(PRODUCT_LINK_SELECTOR).attr('href'),
    rate: parseFloat($(product).find(PRODUCT_RATE_SELECTOR).text()),
    price: $(product).find(PRODUCT_PRICE_SELECTOR).first().text(),
    title: $(product).find(PRODUCT_TITLE_SELECTOR).text().trim(),
    author: {
      url: $(product).find(PRODUCT_AUTHOR_SELECTOR).attr('href'),
      name: $(product).find(PRODUCT_AUTHOR_SELECTOR).text().trim(),
    },
  }));
}

async function parseReviews(product, page) {
  const REVIEW_SELECTOR = '[data-hook=review]';
  const REVIEW_TITLE_SELECTOR = '[data-hook=review-title]';
  const REVIEW_DATE_SELECTOR = '[data-hook=review-date]';
  const REVIEW_BODY_SELECTOR = '[data-hook=review-body]';
  const REVIEW_HELPFUL_SELECTOR = '[data-hook=helpful-vote-statement]';
  const REVIEW_RATE_SELECTOR = '[data-hook=review-star-rating]';
  const REVIEW_AVP_BADGE = '[data-hook=avp-badge]';
  const REVIEW_AUTHOR_SELECTOR = '.a-profile';
  const SEE_ALL_REVIEWS_SELECTOR = '[data-hook=see-all-reviews-link-foot]';

  const url = getReviewsUrl(product.url);
  await page.goto(url, { waitUntil: ['domcontentloaded'] });

  if (await page.$(SEE_ALL_REVIEWS_SELECTOR) !== null) {
    await page.click(SEE_ALL_REVIEWS_SELECTOR);
    await page.waitForNavigation({ waitUntil: ['domcontentloaded'] });
  }

  const content = await page.content();
  const $ = cheerio.load(content);

  return lodash.map($(REVIEW_SELECTOR), review => ({
    avp: Boolean($(review).find(REVIEW_AVP_BADGE).text()),
    rate: parseFloat($(review).find(REVIEW_RATE_SELECTOR).text()),
    date: $(review).find(REVIEW_DATE_SELECTOR).text(),
    body: $(review).find(REVIEW_BODY_SELECTOR).text().trim(),
    title: $(review).find(REVIEW_TITLE_SELECTOR).text().trim(),
    author: {
      url: $(review).find(REVIEW_AUTHOR_SELECTOR).attr('href'),
      name: $(review).find(REVIEW_AUTHOR_SELECTOR).text().trim(),
    },
    helpful: parseInt($(review).find(REVIEW_HELPFUL_SELECTOR).text(), 10) || 0,
  }));
}

async function crawl(text) {
  const browser = await puppeteer.launch(options.launch);
  const page = await browser.newPage();
  await page.setViewport(options.setViewport);

  await search(page, text);
  const totalPages = await getTotalPages(page);

  const parsedProducts = await totalPages.times(
    index => parseProducts(text, page, index + 1),
  );

  const products = lodash.flatMap(parsedProducts);
  const reviewsList = await Promise.map(products, product => parseReviews(product, page));
  const productsWithReviews = lodash.zipWith(products, reviewsList, (product, reviews) => ({
    ...product,
    reviews,
  }));

  logger.info(chalk.blue(`Total pages: ${productsWithReviews.length}`));
  await browser.close();

  return productsWithReviews;
}

export default {
  crawl,
};
