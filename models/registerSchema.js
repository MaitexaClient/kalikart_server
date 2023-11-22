const mongoose = require('mongoose');
const registerSchema = new mongoose.Schema({
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login_tb',
    required: true,
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  credit_points: { type: Number, required: true, default: 0 },
  image: { type: [String], require: true },
  // email: { type: String, required: true },
});

var RegisterData = mongoose.model('register_tb', registerSchema);
module.exports = RegisterData;
