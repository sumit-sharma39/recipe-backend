const User   = require("../models/User");
const bcrypt = require("bcrypt");
const jwt    = require("jsonwebtoken");

const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password)
            return res.status(400).json({ error: "All fields are required" });

        const validatePassword = (p) =>
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,25}$/.test(p);

        if (!validatePassword(password))
            return res.status(400).json({ error: "Password must be 8–25 characters and include uppercase, lowercase, number and special character" });

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing)
            return res.status(409).json({ error: "User already exists. Please login." });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure:   process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge:   24 * 60 * 60 * 1000,
        });

        console.log("cookies", token);

        return res.status(201).json({
            message: "Registration successful",
            token,
            user: { id: newUser._id, name: newUser.name, username: newUser.username, email: newUser.email },
        });

    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = Register;