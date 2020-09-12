
const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
    brandname: {
    type: String,
    required: true
  },
  brandstatus: {
    type: String,
    required: true
  },
  brandpath :{
    type : String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Brand = mongoose.model('Brand', BrandSchema);

module.exports = Brand;
