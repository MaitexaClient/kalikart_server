const mongoose = require('mongoose');
const bannerSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  image: { type: [String], require: true },
  video: { type: [String], require: true },
  videoLength: { type: Number, require: true },

});

var bannerData = mongoose.model('banner_tb', bannerSchema);
module.exports = bannerData;
