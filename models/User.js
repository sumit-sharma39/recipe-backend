const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:                  { type: String, required: true },
    username:              { type: String, required: true, unique: true },
    email:                 { type: String, required: true, unique: true },
    password:              { type: String, required: true },
    failed_login_attempts: { type: Number, default: 0 },
    account_locked_until:  { type: Date, default: null },
    favourites: [{ type: String, ref: 'Recipe' }]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
