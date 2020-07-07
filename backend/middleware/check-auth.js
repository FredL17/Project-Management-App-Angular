// Libraries.
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Get the token from authorization header.
    const token = req.headers.authorization.split(" ")[1];
    // Decode the token to get email and userId.
    const decodedToken = jwt.verify(token, "QhIPViSVv5oNadaoVhvIp5zL0HzH1JQO");
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed." });
  }
};
