
const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    clientname: {
    type: String,
    required: true
  },
  clientaddress: {
    type: String,
    required: true
  },
  clientcity: {
    type: String,
    required: true
  },
  clientstate : {
    type: String,
    required: true
  },
  clientcountry:{
    type : String,
    //required: true
  },
  clientmobile : {
    type: String,
    required:true
  },
  clientuser:{
    type : String,
    required : true
  },
  clientpass :{
    type : String,
    required : true
  },
  status : {
    type : String,
    required : true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
