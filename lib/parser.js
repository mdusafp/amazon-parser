import cheerio from 'cheerio';
import selector from './selector';
import crawler from './crawler';

const mapElementToReview = (index, element) => {
  const $element = cheerio.load(element);
  return {
    url: $element.find(selector.getReviewUrl),
    date: $element.find(selector.getReviewDate),
    text: $element.find(selector.getReviewText),
    stars: $element.find(selector.getReviewStars),
    title: $element.find(selector.getReviewTitle),
    helpful: $element.find(selector.getReviewHelpful),
    isVerifiedPurchase: $element.find(selector.getReviewIsVerifiedPurchase),
  };
};

const parse = html => {
  const $ = cheerio.load(html);

  const seller = {
    brand: $(selector.getBrand).text(),
    link: $(selector.getLink).text(),
    reviews: $(selector.getReview).map(mapElementToReview),
  };

  const next = $(selector.getNextLink);
  if (next) {
    crawler.queue.push($(next).attr('href'));
  }

  return seller;
};

export default {
  parse,
};
