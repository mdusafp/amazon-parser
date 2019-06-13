import $ from 'cheerio';
import Promise from 'bluebird';

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const getHref = value => $(value).attr('href');

export default {
  sleep,
  getHref,
};
