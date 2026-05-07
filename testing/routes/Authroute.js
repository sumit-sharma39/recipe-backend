const express = require("express");
const router = express.Router();

const LoginController = require("../controller/LoginController");
const RegisterController = require("../controller/RegisterController");
const GetMeController = require("../controller/GetMeController");
const UpdateMeController = require("../controller/UpdateMeController");

const auth = require("../middleware/auth");

// ── Public routes ──────────────────────────────
router.post("/login", LoginController);
router.post("/register", RegisterController);

// // ── Protected routes (must be logged in) ───────
router.get("/me", auth, GetMeController);
router.put("/me", auth, UpdateMeController);

module.exports = router;