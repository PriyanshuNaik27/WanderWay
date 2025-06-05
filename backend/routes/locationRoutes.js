const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const { protect } = require("../middleware/authMiddleware");
const Place = require("../models/Place");


router.get("/random-locations", locationController.getRandomLocations);
router.get("/:locationName", locationController.getPlacesFromLocation);
router.post("/add", protect, locationController.addPlace);


// add review route
router.post("/place/:placeId/review", protect, async (req, res) => {
  const { rating, comment } = req.body;
  const { placeId } = req.params;

  try {
    const place = await Place.findById(placeId);
    if (!place) return res.status(404).json({ message: "Place not found" });

    const alreadyReviewed = place.reviews.find(
      (r) => r.user.toString() === req.user.id
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this place" });
    }

    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment,
    };

    place.reviews.push(review);
    await place.save();

    res.status(201).json({ message: "Review added", reviews: place.reviews });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
});


module.exports = router;