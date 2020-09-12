
const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  cname: {
    type: String,
    required: true
  },
  caddress: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state : {
    type: String,
    required: true
  },
  country:{
    type : String,
    required: true
  },
  mobile : {
    type: Number,
    required:true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;
