import _ from 'lodash';
import $ from 'cheerio';

import { getHref } from './utils';
import {
  REVIEW_SELECTOR,
  REVIEW_AVP_BADGE,
  REVIEW_DATE_SELECTOR,
  REVIEW_BODY_SELECTOR,
  REVIEW_RATE_SELECTOR,
  REVIEW_TITLE_SELECTOR,
  REVIEW_HELPFUL_SELECTOR,
  PRODUCT_LINK_SELECTOR,
  PRODUCT_TITLE_SELECTOR,
  PRODUCT_AUTHOR_SELECTOR,
  PRODUCT_PRICE_SELECTOR,
  PRODUCT_RATE_SELECTOR,
  PRODUCT_FEATURE_SELECTOR,
} from './selectors';

const parseProductLinks = page => _.map(page.data(PRODUCT_LINK_SELECTOR), getHref);

const parseProduct = (page) => {
  const author = page.data(PRODUCT_AUTHOR_SELECTOR);

  return {
    rate: parseFloat(page.data(PRODUCT_RATE_SELECTOR).text()) || 0,
    title: page.data(PRODUCT_TITLE_SELECTOR).text().trim(),
    price: page.data(PRODUCT_PRICE_SELECTOR).text(),
    author: {
      url: getHref(author),
      name: author.text(),
    },
    features: _.map(
      page.data(PRODUCT_FEATURE_SELECTOR),
      feature => $(feature).text().trim(),
    ),
  };
};

const parseProductReviews = page => _
  .map(page.data(REVIEW_SELECTOR), review => $(review))
  .map(review => ({
    avp: Boolean(review.find(REVIEW_AVP_BADGE).text()),
    rate: parseFloat(review.find(REVIEW_RATE_SELECTOR).text()) || 0,
    date: review.find(REVIEW_DATE_SELECTOR).text(),
    body: review.find(REVIEW_BODY_SELECTOR).text().trim(),
    title: review.find(REVIEW_TITLE_SELECTOR).text().trim(),
    helpful: _.parseInt(review.find(REVIEW_HELPFUL_SELECTOR).text()) || 0,
  }));

export default {
  parseProduct,
  parseProductLinks,
  parseProductReviews,
};
