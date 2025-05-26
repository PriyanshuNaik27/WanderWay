const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fromLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Place", placeSchema);
