import util from 'util';
import tress from 'tress';
import needle from 'needle';
import parser from './parser';

const get = util.promisify(needle.get);
const results = [];

const worker = async (url, callback) => {
   results.push(parser.parse(await get(url)));
   callback();
};

const queue = tress(worker);

queue.drain = function () {
   fs.writeFileSync('./results.json', JSON.stringify(results, null, 4));
}

export default {
   queue,
};
