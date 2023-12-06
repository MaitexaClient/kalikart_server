const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login_tb',
    required: true,
  },
  addressCount: { type: Number, require: true, default: 1 },
  name: { type: String, require: true },
  phone: { type: String, require: true },
//   address: { type: String, require: true },
  pincode: { type: String, required: true, default: '' },
  state: { type: String, required: true, default: '' },
  city: { type: String, required: true, default: '' },
  landmark: { type: String, required: true, default: '' },
  addressType:{type:String,require:true}
});

var addressData = mongoose.model('address_tb', addressSchema);
module.exports = addressData;
