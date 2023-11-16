const mongoose = require('mongoose');
const shopRegisterSchema = new mongoose.Schema({
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login_tb',
    required: true,
  },
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cities_tb',
    required: true,
  },
  shop_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String, required: true },
  latitude: { type: String, require: true },
  longitude: { type: String, require: true },
});

var shopRegisterData = mongoose.model('shopRegister_tb', shopRegisterSchema);
module.exports = shopRegisterData;
