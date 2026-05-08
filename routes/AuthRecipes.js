const express = require('express');
const router  = express.Router();

const FetchRecipes   = require("../controller/FetchRecipesController");
const DeleteRecipe   = require("../controller/DeleteRecipecontroller");
const AddRecipe      = require("../controller/AddRecipeController");
const RecipeById     = require("../controller/Recipebyidcontroller");
const UpdateRecipe   = require("../controller/UpdateRecipe");
const { toggleFavourite, getFavourites } = require("../controller/FavouriteController");

const auth                  = require("../middleware/auth");
const { recipeRateLimiter } = require("../middleware/RateLimiter");

router.get("/",              recipeRateLimiter, FetchRecipes);
router.post("/",             recipeRateLimiter, auth, AddRecipe);

// Favourites — must be above /:id to avoid conflict
router.get("/favourites",    recipeRateLimiter, auth, getFavourites);
router.put("/:id/favorite",  recipeRateLimiter, auth, toggleFavourite);

router.get("/:id",           recipeRateLimiter, RecipeById);
router.put("/:id",           recipeRateLimiter, auth, UpdateRecipe);
router.delete("/:id",        recipeRateLimiter, auth, DeleteRecipe);

module.exports = router;