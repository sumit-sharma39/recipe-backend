// controller/FavouriteController.js
const User   = require('../models/User');
const Recipe = require('../models/Recipe');

const toggleFavourite = async (req, res) => {
    try {
        const user     = await User.findById(req.user.id);
        const recipeId = req.params.id;
        const isSaved  = user.favourites.map(String).includes(String(recipeId));

        if (isSaved) {
            user.favourites = user.favourites.filter(id => String(id) !== String(recipeId));
        } else {
            user.favourites.push(recipeId);
        }

        await user.save();
        const recipe = await Recipe.findById(recipeId).lean();
        res.json({ ...recipe, isFavorite: !isSaved });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getFavourites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favourites');
        res.json({ favourites: user.favourites });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { toggleFavourite, getFavourites };