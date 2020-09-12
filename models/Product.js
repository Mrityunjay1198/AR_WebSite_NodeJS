
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productname: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  productpath :{
    type : String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
