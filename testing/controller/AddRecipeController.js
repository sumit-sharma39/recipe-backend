const Recipe = require("../models/Recipe");

const AddRecipe = async (req, res) => {
    try {
        const { title, description, category, time, servings, difficulty, image, ingredients, steps } = req.body;

        if (!title || !time || !category)
            return res.status(400).json({ error: "Title, time and category are required" });

        const newRecipe = await Recipe.create({
            title:       title.trim(),
            description: description?.trim() || "",
            category,
            time:        Number(time),
            servings:    Number(servings) || 2,
            difficulty:  difficulty || "Easy",
            image:       image || "🍽️",
            ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split("\n").filter(Boolean),
            steps:       Array.isArray(steps) ? steps : steps.split("\n").filter(Boolean),
            authorId:    req.user.id,
            author:      req.user.username,
        });

        return res.status(201).json(newRecipe);
    } catch (err) {
        console.error("AddRecipe error:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = AddRecipe;