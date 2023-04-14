const nock = require("nock");
const axios = require("axios");
var chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const sellerListingsUpdater = require("./run.js");

chai.use(chaiAsPromised);
const assert = require("chai").assert;

describe("Seller Listings Updater request tu meli", function () {
  it("Should make several request to meli with different offsets", () => {
    nock("https://api.mercadolibre.com")
      .get("/sites/MLM/search?seller_id=154901871&offset=0")
      .reply(200); //poner el objeto que espero

    nock("https://api.mercadolibre.com")
      .get("/sites/MLM/search?seller_id=154901871&offset=50")
      .reply(200);

    nock("https://api.mercadolibre.com")
      .get("/sites/MLM/search?seller_id=154901871&offset=100")
      .reply(200);

    nock("https://api.mercadolibre.com")
      .get("/sites/MLM/search?seller_id=154901871&offset=150")
      .reply(200);

    nock("https://api.mercadolibre.com")
      .get("/sites/MLM/search?seller_id=154901871&offset=500")
      .reply(200);

    nock("https://api.mercadolibre.com")
      .get("/sites/MLM/search?seller_id=154901871&offset=750")
      .reply(200);

    nock("https://api.mercadolibre.com")
      .get("/sites/MLM/search?seller_id=154901871&offset=950")
      .reply(200);

    sellerListingsUpdater();
  });
});

describe("Seller Listings Updater post to listings tracker", function () {
  it("Should make a post to listings tracker", () => {
    nock("http://localhost:900").get("/listings/upsert").reply(200);

    sellerListingsUpdater();

  });
});