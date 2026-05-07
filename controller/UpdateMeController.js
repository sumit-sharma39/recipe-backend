const User = require("../models/User");

const UpdateMeController = async (req, res) => {
    try {
        const { name, username, email } = req.body;

        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { name, username, email },
            { new: true, runValidators: true }
        ).select("-password -failed_login_attempts -account_locked_until");

        if (!updated)
            return res.status(404).json({ error: "User not found" });

        return res.status(200).json(updated);
    } catch (err) {
        if (err.code === 11000)
            return res.status(400).json({ error: "Username or email already taken" });
        console.error("UpdateMeController error:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = UpdateMeController;