const jwt = require("jsonwebtoken");

// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;

    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        res
          .status(403)
          .send({ message: "Token is not valid", error: err.message });
      } else {
        req.user = authData;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No token provided" });
  }
};
module.exports = { verifyToken };
