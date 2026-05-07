const Recipe = require("../models/Recipe");

const GetRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });
        return res.status(200).json(recipe);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = GetRecipeById;