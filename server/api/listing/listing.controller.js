var Listing = require("./listing.model");

function createNewListing(listing) {
  var newListing = listing;
  newListing.initial_sold_quantity = listing.sold_quantity;
  return Listing.create(newListing);
}

function updateExistingListing(listingFound, listing) {
  var newQuantity = listing.sold_quantity - listingFound.initial_sold_quantity;
  listingFound.quantity = newQuantity;
  return listingFound.save();
}

exports.getAll = (req, res) => Listing.find({}).sort({quantity: -1});

exports.getOne = (req, res) =>
  Listing.findOne({
    listing_id: req.params.listing_id,
  }).then((listing) => {
    if (!listing) {
      throw { name: "NotFound", statusCode: 404 };
    }
    return listing;
  });

exports.create = (req, res) => {
  return createNew(req.body);
};

exports.update = (req, res) => {
  return Listing.findOne({
    listing_id: req.params.listing_id,
  })
    .then((listing) => {
      if (!listing) {
        throw { name: "NotFound", statusCode: 404 };
      }
      return listing;
    })
    .then((listing) => {
      return updateNew(listing, req.body);
    });
};

exports.getNOrderedBySold = (req, res) =>
  Listing.find({})
    .sort({ quantity: -1 })
    .limit(req.query.amount ? parseInt(req.query.amount) : 3);

exports.createAndUpdate = (req, res) => {
  var listings = req.body;

  if (listings.length > 50) {
    return res
      .status(400)
      .json({ error: "The request body can have a maximum of 50 elements." });
  }

  var newListings = [];

  var promises = listings.map((listing) => {
    return Listing.findOne({ listing_id: listing.listing_id })
      .then((listingFound) => {
        if (!listingFound) {
          return createNewListing(listing);
        } else {
          return updateExistingListing(listingFound, listing);
        }
      })
      .then((listingAdd) => newListings.push(listingAdd))
  });

  Promise.all(promises).catch(() => console.log("Something went wrong when trying to add/update a listing"))
  .then(() => {
    newListings.sort(sortListingsByQuantity);
    return res.json(newListings).status(200);
  });
};

function sortListingsByQuantity (a, b) {
    if (a.quantity > b.quantity) {
      return 1;
    } else if (a.quantity < b.quantity) {
      return -1;
    } else {
      return 0;
    }
  };