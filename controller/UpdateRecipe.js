const Recipe = require("../models/Recipe");

const UpdateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });
        if (recipe.authorId.toString() !== req.user.id.toString())
            return res.status(403).json({ message: "Not authorized" });

        const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(updated);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = UpdateRecipe;