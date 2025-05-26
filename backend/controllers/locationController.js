const Location = require("../models/Location");
const Place = require("../models/Place");

exports.getPlacesFromLocation = async (req, res) => {
  try {
    const location = await Location.findOne({ name: req.params.locationName });
    if (!location) return res.json({ places: [] });

    const places = await Place.find({ fromLocation: location._id });
    res.json({ places });
  } catch (error) {
    res.status(500).json({ message: "Error fetching places", error });
  }
};

exports.addPlace = async (req, res) => {
  try {
    const { locationName, placeName } = req.body;

    let location = await Location.findOne({ name: locationName });
    if (!location) {
      location = new Location({ name: locationName });
      await location.save();
    }

    const place = new Place({
      name: placeName,
      fromLocation: location._id,
      addedBy: req.user.id,
    });

    await place.save();
    res.json({ message: "Place added" });
  } catch (error) {
    res.status(500).json({ message: "Error adding place", error });
  }
};
