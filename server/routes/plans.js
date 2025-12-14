const router = require("express").Router();
const Plan = require("../models/Plan");
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const newPlan = new Plan(req.body);
    const savedPlan = await newPlan.save();
    res.status(200).json(savedPlan);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const plans = await Plan.find().populate("trainer", "name");
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).populate("trainer", "name");
    res.status(200).json(plan);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPlan);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.status(200).json("Plan has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/:id/subscribe", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json("User not found");

    if (!user.purchasedPlans.includes(req.params.id)) {
      await user.updateOne({ $push: { purchasedPlans: req.params.id } });
    }
    
    res.status(200).json("Subscribed successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;