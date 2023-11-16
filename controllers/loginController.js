const loginSchema = require('../models/loginSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// LoginRouter.post('/', async (req, res) => {
exports.login = async (req, res) => {
  try {
    console.log(req.body.username);
    console.log(req.body.password);
    if (req.body.username && req.body.password) {
      const oldUser = await loginSchema.findOne({
        username: req.body.username,
      });
      if (!oldUser) {
        return res.status(400).json({
          Success: false,
          Error: true,
          Message: 'You have to Register First',
        });
      }

      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        oldUser.password
      );
      if (!isPasswordCorrect) {
        return res.json({
          Success: false,
          Error: true,
          Message: 'Password Incorrect',
        });
      }
      // ------------------------------
      // return res.json({
      //   Success: true,
      //   Error: false,
      //   Message: 'Success',
      // });
      // ------------------------------

      const token = jwt.sign(
        {
          userId: oldUser._id,
          userName: oldUser.username,
          userRole: oldUser.role,
        },
        process.env.TOKEN_SECRET_KEY,
        // 'secret_this_should_longer',
        {
          expiresIn: '1h',
        }
      );
      console.log('token', token);
      return res.status(200).json({
        success: true,
        error: false,
        token: token,
        expiresIn: 3600,
        loginId: oldUser._id,
        userName: oldUser.username,
        userRole: oldUser.role,
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'All field are required',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      ErrorMessage: error,
      Message: 'Internal Server Error',
    });
  }
};
