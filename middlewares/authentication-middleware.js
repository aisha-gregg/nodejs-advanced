const jwt = require("jsonwebtoken");
const express = require("express");

const authenticationMiddleware = express.Router();

authenticationMiddleware.use((req, res, next) => {
  const token = req.headers["access-token"];

  if (token) {
    jwt.verify(token, process.env.ACCESS_KEY, (err, decoded) => {
      if (err) {
        res.status(401);
        return res.json({ mensaje: "Invalid Token" });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401);
    res.send({
      mensaje: "Token not provided"
    });
  }
});

module.exports = authenticationMiddleware;
