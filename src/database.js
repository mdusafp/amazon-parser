import mongoose, { Schema } from 'mongoose';

const AuthorSchema = new Schema({
  url: String,
  name: String,
});

const ReviewSchema = new Schema({
  avp: Boolean,
  rate: Number,
  date: String,
  body: String,
  title: String,
  helpful: Number,
});

const ProductSchema = new Schema({
  url: String,
  rate: Number,
  topic: String,
  title: String,
  price: String,
  reviews: [ReviewSchema],
});

mongoose.model('Author', AuthorSchema);
mongoose.model('Review', ReviewSchema);
export const Product = mongoose.model('Product', ProductSchema);

export async function connect() {
  mongoose.connect(process.env.DB_URI, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
  });
}

export async function disconnect() {
  mongoose.disconnect();
}

export default {
  connect,
  disconnect,
  Product,
};
