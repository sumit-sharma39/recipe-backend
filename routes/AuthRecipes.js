const express = require('express');
const router  = express.Router();

const FetchRecipes = require("../controller/FetchRecipesController");
const DeleteRecipe = require("../controller/DeleteRecipecontroller");
const AddRecipe    = require("../controller/AddRecipeController");
const RecipeById   = require("../controller/Recipebyidcontroller");
const UpdateRecipe = require("../controller/UpdateRecipe");

const auth                  = require("../middleware/auth");
const { recipeRateLimiter } = require("../middleware/RateLimiter");

router.get("/",       recipeRateLimiter, FetchRecipes);
router.post("/",      recipeRateLimiter, auth, AddRecipe);
router.get("/:id",    recipeRateLimiter, RecipeById);
router.put("/:id",    recipeRateLimiter, auth, UpdateRecipe);
router.delete("/:id", recipeRateLimiter, auth, DeleteRecipe);

module.exports = router;