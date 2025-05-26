const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:locationName", locationController.getPlacesFromLocation);
router.post("/add", protect, locationController.addPlace);

module.exports = router;