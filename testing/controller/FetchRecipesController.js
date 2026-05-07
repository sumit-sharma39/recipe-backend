const fs = require("fs");
const path = require("path");
const Recipe = require("../models/Recipe");

const GetAllRecipes = async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = {};

        if (category && category !== "All")
            filter.category = category;

        if (search && search.trim() !== "")
            filter.title = { $regex: search.trim(), $options: "i" };

        // Fetch from DB
        let dbRecipes = await Recipe.find(filter).sort({ createdAt: -1 });

        // Always load JSON fallback recipes
        const jsonPath = path.join(__dirname, "../recipes.json");
        const rawData = fs.readFileSync(jsonPath, "utf-8");
        let jsonRecipes = JSON.parse(rawData);

        // Apply filters to JSON recipes too
        if (category && category !== "All")
            jsonRecipes = jsonRecipes.filter(r => r.category === category);

        if (search && search.trim() !== "") {
            const regex = new RegExp(search.trim(), "i");
            jsonRecipes = jsonRecipes.filter(r => regex.test(r.title));
        }

        // Merge DB recipes first, then JSON recipes
        const recipes = [...dbRecipes, ...jsonRecipes];

        return res.status(200).json(recipes);
    } catch (err) {
        console.error("GetAllRecipes error:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = GetAllRecipes;