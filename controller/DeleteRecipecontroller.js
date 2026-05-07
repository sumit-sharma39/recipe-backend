const Recipe = require("../models/Recipe");

const DeleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });
        if (recipe.authorId.toString() !== req.user.id.toString())
            return res.status(403).json({ message: "Not authorized" });

        await Recipe.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Recipe deleted" });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = DeleteRecipe;