import _ from 'lodash';
import Promise from 'bluebird';

import parser from './parser';
import { getHref, sleep } from './utils';
import {
  NEXT_LINK_SELECTOR,
  SEE_ALL_REVIEWS_SELECTOR,
} from './selectors';
import { Product } from './database';

export default class Crawler {
  constructor(httpProvider) {
    this.httpProvider = httpProvider;
    this.products = [];
    this.topic = '';
  }

  async traverse(searchPage) {
    const links = parser.parseProductLinks(searchPage);

    const pages = await Promise.map(links, link => this.httpProvider.get(link));
    const products = _.map(pages, productPage => parser.parseProduct(productPage));

    const reviewListPages = await Promise.map(pages, (productPage) => {
      const link = getHref(productPage.data(SEE_ALL_REVIEWS_SELECTOR));
      return this.httpProvider.get(link);
    });

    // TODO: load another pages of reviews
    const parsedReviews = _.map(
      reviewListPages,
      page => parser.parseProductReviews(page),
    );

    // products with reviews
    const withResolver = (product, reviews) => ({
      ...product,
      reviews,
      topic: this.topic,
    });

    const productsWithReviews = _.zipWith(products, parsedReviews, withResolver);

    this.products = _.concat(this.products, productsWithReviews);
    await Product.insertMany(productsWithReviews);

    // wait 5 sec
    await sleep(5 * 1000);

    const next = searchPage.data(NEXT_LINK_SELECTOR);
    if (!next.html() || next.hasClass('a-disabled')) {
      return this.products;
    }

    return this.traverse(await this.httpProvider.get(getHref(next)));
  }

  async crawl(topic) {
    const searchPage = await this.httpProvider.get(`/s?k=${topic}`);
    this.topic = topic;
    return this.traverse(searchPage);
  }
}
