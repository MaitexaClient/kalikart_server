const mongoose = require('mongoose');
const citiesSchema = new mongoose.Schema({
  city: { type: String, required: true },
});

var citiesData = mongoose.model('cities_tb', citiesSchema);
module.exports = citiesData;
