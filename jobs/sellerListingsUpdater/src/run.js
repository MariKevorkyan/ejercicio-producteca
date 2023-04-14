const axios = require("axios");

const sellerId = 154901871;
var hasMore = true;
var newListings;
var concurrentLimit = 5;

let offsets = [
  0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750,
  800, 850, 900, 950
];

function callTasks(concurrentLimit) {
  var currentTask = 0;
  function createTaskInstance() {
    while (currentTask < offsets.length) { //sacar este while, usar un map
        fetchListings(offsets[currentTask++]);
    }
  }
  var tasks = [];
  for (let i = 0; i < concurrentLimit; i++) {
    tasks.push(createTaskInstance());
  }
  return Promise.all(tasks);
}

function fetchListings(offset) { //retornar TODAS las promises
  axios
    .get(
      `https://api.mercadolibre.com/sites/MLM/search?seller_id=${sellerId}&offset=${offset}`
    )
    .then((responses) => {
      const resultsListings = responses.data.results;

      if (resultsListings.length === 0) {
        console.log("The seller has no more listings");
        hasMore = false;
        return newListings;
      }

      newListings = createNewListings(resultsListings);

      callListingTracker(newListings);
      console.log(offset);

    })
    .catch(() =>
      console.log("The request to the API of Mercado Libre was not successful")
    );
}

function createNewListings(listingsList) {
  return listingsList.map((listing) => {
    //nueva lista de listings pero solo con la info que necesito
    const newListing = {
      //crea un objeto para cada listing traido
      listing_id: listing.id,
      title: listing.title,
      sold_quantity: listing.sold_quantity,
      seller_id: sellerId,
    };
    return newListing;
  });
}

function callListingTracker(listingsToSend) {
  axios
    .post("http://localhost:9000/listings/upsert", listingsToSend)
    .catch(() =>
      console.log("The request to ListingTracker was not successful")
    );
}

function sellerListingsUpdater() {
    callTasks(concurrentLimit);
}

module.exports = sellerListingsUpdater;
