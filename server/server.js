const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); 

const authRoutes = require("./routes/auth");
const planRoutes = require("./routes/plans");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

mongoose
  .connect("mongodb+srv://joshigopala227_db_user:t78Jg2hkP5OyJsSa@cluster0.eyocx9z.mongodb.net/fitplanhub?appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("DB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("Backend is Running!");
});

app.use("/auth", authRoutes);
app.use("/plans", planRoutes);
app.use("/users", userRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});