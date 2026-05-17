const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const viewsDirectory = path.join(__dirname, "..", "views");

router.get("/", (req, res) => {
  res.sendFile(path.join(viewsDirectory, "index.html"));
});

router.get("/:page", (req, res) => {
  const page = req.params.page;
  const filePath = path.join(viewsDirectory, `${page}.html`);
  
  fs.exists(filePath, (exists) => {
    if (exists) {
      res.sendFile(filePath);
    } else {
      res.sendFile(path.join(viewsDirectory, "404.html"));
    }
  });
});

module.exports = router;