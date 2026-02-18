const authMiddleware = (req, res, next) => {
  // Dummy user for testing
  req.user = {
    id: "65f1a1111111111111111111"  // Put any valid Mongo ObjectId
  };

  next();
};

module.exports = authMiddleware;
