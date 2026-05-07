const express = require('express')
const router = express.Router();

const FetchRecipes= require("../controller/FetchRecipesController");
const DeleteRecipe = require("../controller/DeleteRecipecontroller");
const AddRecipe=require("../controller/AddRecipeController");
const RecipeById=require ("../controller/Recipebyidcontroller");
const UpdateRecipe=require("../controller/UpdateRecipe");

const auth =require("../middleware/auth");


router.get("/",           FetchRecipes);
router.post("/",     auth, AddRecipe);
router.get("/:id",        RecipeById);
router.put("/:id",   auth, UpdateRecipe);
router.delete("/:id", auth, DeleteRecipe);

module.exports = router;