const jwt = require("jsonwebtoken");

exports.generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: "2d",
    // expiresIn: "15m",
  });
};

exports.generateToken = ( id ) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
    // expiresIn: "5m",
  });
};


exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.TOKEN_SECRET);
};