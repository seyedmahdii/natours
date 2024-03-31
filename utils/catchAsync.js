module.exports = (fn) => {
  return (req, res, next) => {
    // we need the next() function in order to  it. so that error can be handled in globalErrorHandler
    // Async functions return promise
    fn(req, res, next).catch((err) => next(err));
  };
};
