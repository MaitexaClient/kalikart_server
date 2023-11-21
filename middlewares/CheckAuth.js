const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.userData = {
      userId: decodedToken.userId,
      userName: decodedToken.userName,
      userRole: decodedToken.userRole,
    };
    console.log(req.userData);

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed!' });
  }
};
