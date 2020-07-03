const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "QhIPViSVv5oNadaoVhvIp5zL0HzH1JQO");
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed." });
  }
};
