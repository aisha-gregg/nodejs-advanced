"use strict";
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  if (req.body.user === "user@example.com" && req.body.password === "1234") {
    const payload = {
      check: true
    };
    const token = jwt.sign(payload, process.env.ACCESS_KEY, {
      expiresIn: 60_000
    });
    res.json({
      mensaje: "Autenticación correcta",
      token: token
    });
  } else {
    res.json({ mensaje: "Usuario o contraseña incorrectos" });
  }
});

module.exports = router;
