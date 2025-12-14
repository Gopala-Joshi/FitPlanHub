const router = require("express").Router();
const User = require("../models/User");

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...other } = user._doc; 
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId === req.params.id) {
    return res.status(403).json("Cannot follow yourself");
  }

  try {
    const currentUser = await User.findById(req.body.userId);

    if (!currentUser.following.includes(req.params.id)) {
      await currentUser.updateOne({ $push: { following: req.params.id } });
      res.status(200).json("User has been followed");
    } else {
      await currentUser.updateOne({ $pull: { following: req.params.id } });
      res.status(200).json("User has been unfollowed");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;