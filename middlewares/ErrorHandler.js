const ErrorHandler = (err, req, res, next) => {
  console.log('Middleware Error Handling');
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';
  return res.status(errStatus).json({
    Success: false,
    Error: true,
    StatusCode: errStatus,
    Message: 'Internal Server Error',
    ErrorMessage: errMsg,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
};

module.exports = ErrorHandler;
