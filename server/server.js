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
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("DB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("Backend is Running!");
});

app.use("/auth", authRoutes);
app.use("/plans", planRoutes);
app.use("/users", userRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  console.log(` Server running on port ${PORT}`);