const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  shortDescription: { type: String }, 
  
  workoutPlan: [
    {
      day: { type: Number, default: 1 },
      exercises: [String] 
    }
  ],
  
  dietPlan: [
    {
      day: { type: Number, default: 1 },
      meals: [String] 
    }
  ],
  
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  trainerId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Plan", PlanSchema);