const jwt = require("jsonwebtoken");
const User = require("../models/User");
const secretKey = "myTokenSecretKey";
const authenticate = async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, secretKey);
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(401).send({ error: "User not found" });
      }
  
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ error: "Unauthorized: Invalid token" });
    }
  };

module.exports = authenticate;
