
const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
  country:{
    type : String,
    required: true
  } 
});

const Country = mongoose.model('Country', CountrySchema);

module.exports = Country;
