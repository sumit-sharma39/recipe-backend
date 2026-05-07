const User   = require("../models/User");
const bcrypt = require("bcrypt");
const jwt    = require("jsonwebtoken");

const MAX_ATTEMPTS = 5;
const LOCK_TIME    = 15; // minutes

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ error: "Email and password are required" });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user)
            return res.status(401).json({ error: "Invalid email or password" });

        // check if account is locked
        if (user.account_locked_until && new Date(user.account_locked_until) > new Date()) {
            const remaining = Math.ceil((new Date(user.account_locked_until) - new Date()) / 60000);
            return res.status(403).json({ error: `Account locked. Try again in ${remaining} minute(s).` });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            const attempts = (user.failed_login_attempts || 0) + 1;

            if (attempts >= MAX_ATTEMPTS) {
                await User.findByIdAndUpdate(user._id, {
                    failed_login_attempts: 0,
                    account_locked_until:  new Date(Date.now() + LOCK_TIME * 60 * 1000),
                });
                return res.status(403).json({ error: `Too many failed attempts. Account locked for ${LOCK_TIME} minutes.` });
            }

            await User.findByIdAndUpdate(user._id, { failed_login_attempts: attempts });
            return res.status(401).json({ error: `Invalid email or password. Attempt ${attempts}/${MAX_ATTEMPTS}` });
        }

        // reset on success
        await User.findByIdAndUpdate(user._id, {
            failed_login_attempts: 0,
            account_locked_until:  null,
        });

        const token = jwt.sign(
            { id: user._id, username: user.username },
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

        return res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, username: user.username, email: user.email },
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = Login;