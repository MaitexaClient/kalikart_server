const mongoose = require('mongoose');
const creditPointSchema = new mongoose.Schema({
  credit_point: { type: Number, required: true },
  price: { type: Number, required: true },
  price_per_credit_point: { type: Number, require: true },
});

var creditPointData = mongoose.model('creditPoint_tb', creditPointSchema);
module.exports = creditPointData;
