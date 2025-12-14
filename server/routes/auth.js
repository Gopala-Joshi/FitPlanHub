const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role || "USER",
    });

    const user = await newUser.save();

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      "secretkey", 
      { expiresIn: "5d" }
    );

    res.status(200).json({ token, role: user.role, id: user._id });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Wrong password");

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      "secretkey", 
      { expiresIn: "5d" }
    );

    res.status(200).json({ token, role: user.role, id: user._id });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;