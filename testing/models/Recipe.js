const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    description: { type: String, default: "" },
    category:    { type: String, required: true },
    time:        { type: Number, required: true },
    servings:    { type: Number, default: 2 },
    difficulty:  { type: String, default: "Easy" },
    image:       { type: String, default: "🍽️" },
    ingredients: [String],
    steps:       [String],
    authorId:    { type: String },
    author:      { type: String },
    rating:      { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Recipe", RecipeSchema);