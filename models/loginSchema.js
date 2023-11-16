const mongoose = require('mongoose');
const loginSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Number, required: true },
});

var loginData = mongoose.model('login_tb', loginSchema);
module.exports = loginData;
