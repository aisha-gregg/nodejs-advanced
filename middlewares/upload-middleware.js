const multer = require("multer");

const uploadMiddleware = multer({
  limits: {
    fileSize: 4 * 1024 * 1024
  }
});

module.exports = uploadMiddleware;
