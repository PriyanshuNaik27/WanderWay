const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  date: { type: Date, default: Date.now },
});

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fromLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reviews: [reviewSchema],
});

module.exports = mongoose.model("Place", placeSchema);
