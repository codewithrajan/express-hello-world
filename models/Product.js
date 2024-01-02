const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  totalQuantity: { type: Number, required: true },
  leftQuantity: { type: Number, required: true },
  images: [{ type: String }],
  description: { type: String },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
