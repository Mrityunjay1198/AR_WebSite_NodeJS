
const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    shopname: {
    type: String,
    required: true
  },
  shopaddress: {
    type: String,
    required: true
  },
  shopcity: {
    type: String,
    required: true
  },
  shopstate : {
    type: String,
    required: true
  },
  shopcountry:{
    type : String,
    required: true
  },
  contactname : {
      type : String,
      required :true
  },

  shopmobile : {
    type: Number,
    required:true
  },
  shopstatus : {
    type : String,
    required : true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Shop = mongoose.model('Shop', ShopSchema);

module.exports = Shop;
