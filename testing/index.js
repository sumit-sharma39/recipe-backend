const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require("./Database/Database");

const AuthRoutes   = require("./routes/Authroute");
const AuthRecipes  = require("./routes/AuthRecipes");
const uploadRouter = require("./routes/upload");  // ← was middleware/cloudinary

const app = express();
connectDB();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',    AuthRoutes);
app.use('/api/recipes', AuthRecipes);
app.use('/api/upload',  uploadRouter);  // ← added missing /

app.use((req, res) => {
    res.status(404).json({ message: "Route was not found" });
});

const PORT = process.env.SERVER_PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});