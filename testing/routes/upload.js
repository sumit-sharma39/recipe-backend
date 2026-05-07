const express = require("express");
const { upload } = require("../middleware/cloudinary");

const router = express.Router();

router.post("/", upload.single("file"), (req, res) => {
  try {
    console.log("Cloudinary",req.file);
    res.status(200).json({ url: req.file.path });
  } catch (err) {
    res.status(500).json({ message: "Image upload failed" });
  }
});

module.exports = router;