const bcrypt = require('bcryptjs');
const registerDB = require('../models/registerSchema');
const shopRegisterDB = require('../models/shopRegisterSchema');
const loginDB = require('../models/loginSchema');
const citiesData = require('../models/citiesSchema');

// =====================user registration==================================
exports.register = async (req, res) => {
  try {
    const oldUser = await loginDB.findOne({ username: req.body.username });
    if (oldUser) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Username already exist, Please Log In',
      });
    }
    const oldPhone = await registerDB.findOne({ phone: req.body.phone });
    if (oldPhone) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Phone already exist',
      });
    }
    const oldEmail = await registerDB.findOne({ email: req.body.email });
    if (oldEmail) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Email already exist',
      });
    }
    console.log(req.body.password);
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    let log = {
      username: req.body.username,
      password: hashedPassword,
      role: 2,
    };
    const result = await loginDB(log).save();
    let reg = {
      login_id: result._id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };
    const result2 = await registerDB(reg).save();

    if (result2) {
      return res.json({
        Success: true,
        Error: false,
        data: result2,
        Message: 'Registration Successful',
      });
    } else {
      return res.json({
        Success: false,
        Error: true,
        Message: 'Registration Failed',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
    });
  }
};

// =====================shop registration==================================

exports.shopRegister = async (req, res) => {
  try {
    const oldShopName = await loginDB.findOne({
      shop_name: req.body.shop_name,
    });
    if (oldShopName) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Shop name already exist',
      });
    }
    const oldShopUsername = await loginDB.findOne({
      username: req.body.username,
    });
    if (oldShopUsername) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Username already exist, Please Log In',
      });
    }
    const oldPhone = await shopRegisterDB.findOne({ phone: req.body.phone });
    if (oldPhone) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Phone number already exist',
      });
    }
    const oldEmail = await shopRegisterDB.findOne({ email: req.body.email });
    if (oldEmail) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Email already exist',
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    let log = {
      username: req.body.username,
      password: hashedPassword,
      role: 2,
    };
    const result = await loginDB(log).save();
    // const cityData = await citiesData.findOne({ _id: req.body.city_id });
    // console.log(cityData);
    let reg = {
      login_id: result._id,
      city_id: req.body.city_id,
      shop_name: req.body.shop_name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      image: req.file.path,
    };
    const result2 = await shopRegisterDB(reg).save();

    if (result2) {
      return res.json({
        Success: true,
        Error: false,
        data: result2,
        Message: 'Registration Successful',
      });
    } else {
      return res.json({
        Success: false,
        Error: true,
        Message: 'Registration Failed',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
    });
  }
};
