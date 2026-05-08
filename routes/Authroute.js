const express = require("express");
const router = express.Router();

const LoginController    = require("../controller/LoginController");
const RegisterController = require("../controller/RegisterController");
const GetMeController    = require("../controller/GetMeController");
const UpdateMeController = require("../controller/UpdateMeController");

const auth                        = require("../middleware/auth");
const { authRateLimiter }         = require("../middleware/RateLimiter");

router.post("/login",    authRateLimiter, LoginController);
router.post("/register", authRateLimiter, RegisterController);

router.get("/me",  auth, GetMeController);
router.put("/me",  auth, UpdateMeController);

module.exports = router;