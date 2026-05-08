const express = require("express");
const { upload } = require("../middleware/cloudinary");

const router = express.Router();

router.post("/", upload.single("file"), (req, res) => {
  try {
    console.log("Cloudinary",req.file);
    console.log("File uploaded")
    res.status(200).json({ url: req.file.path });
  } catch (err) {
    console.log("failed")
    res.status(500).json({ message: "Image upload failed" });
  }
});

module.exports = router;