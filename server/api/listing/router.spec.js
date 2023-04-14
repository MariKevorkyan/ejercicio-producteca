var request = require("supertest");
var app = include("app").app;
var Listing = require("./listing.model");

describe("Listing", () => {
  var listings = [
    {
      listing_id: "MLA1111",
      title: "Samsung Galaxy",
      seller_id: 1234,
      initial_sold_quantity: 12,
      quantity: 5,
    },
    {
      listing_id: "MLA2222",
      title: "Motorola",
      seller_id: 5678,
      initial_sold_quantity: 11,
      quantity: 4,
    },
    {
      listing_id: "MLA3333",
      title: "Iphone",
      seller_id: 9101,
      initial_sold_quantity: 11,
      quantity: 3,
    },
  ];

  beforeEach((done) => {
    Promise.all(listings.map((listing) => Listing.create(listing))).then(() =>
        done()
    );
  });

  describe("POST /listings", function () {
    it("should create the listing with the given sold_quantity as the initial_sold_quantity", (done) => {
      var data = {
        listing_id: "MLA1234",
        title: "iPhone 6s 32GB",
        seller_id: 1234,
        sold_quantity: 20,
      };

      request(app).post("/listings").send(data).expect(
        200,
        {
          listing_id: "MLA1234",
          title: "iPhone 6s 32GB",
          seller_id: 1234,
          initial_sold_quantity: 20,
          quantity: 0,
        },
        done
      );
    });
  });

  describe("GET /listings", function () {
    it("should return all the listings", (done) => {
      request(app).get("/listings").expect(200, listings, done);
    });
  });

  describe("GET /listings/:listing_id", function () {
    it("should return the requested listing", (done) => {
      request(app).get("/listings/MLA1111").expect(200, listings[0], done);
    });

    it("should return 404 Not Found when the requested listing does not exist", (done) => {
      request(app).get("/listings/WRONGID").expect(404, done);
    });
  });

  describe("PUT /listings/:listing_id", function () {
    it("should update the listing incrementing the quantity with the difference between the current sold_quantity and the initial_sold_quantity", (done) => {
      var data = {
        sold_quantity: 14,
      };

      request(app).put("/listings/MLA1111").send(data).expect(
        200,
        {
          listing_id: "MLA1111",
          title: "Samsung Galaxy",
          seller_id: 1234,
          initial_sold_quantity: 12,
          quantity: 2,
        },
        done
      );
    });

    it("should return 404 Not Found when the requested listing does not exist", (done) => {
      request(app).put("/listings/WRONGID").send({}).expect(404, done);
    });
  });

  describe("GET /listings/ranking/:amount?", function () {
    var data = [
      {
        listing_id: "MLA1111",
        title: "Samsung Galaxy",
        seller_id: 1234,
        initial_sold_quantity: 12,
        quantity: 5,
      },
      {
        listing_id: "MLA2222",
        title: "Motorola",
        seller_id: 5678,
        initial_sold_quantity: 11,
        quantity: 4,
      },
    ];

    it("should return the the first -amount- listings", (done) => {
      request(app).get("/listings/ranking?amount=2").expect(200, data, done);
    });

    it("should return the 3 most sold listings", (done) => {
      request(app).get("/listings/ranking").expect(200, listings, done);
    });
  });

    describe("POST /listings/upsert", function () {
      var data = [
        {
          listing_id: "MLA2222",
          title: "Motorola",
          seller_id: 5678,
          sold_quantity: 20,
        },
        {
          listing_id: "MLA3333",
          title: "Iphone",
          seller_id: 9101,
          sold_quantity: 25,
        },
        {
          listing_id: "MLA4444",
          title: "Huawei",
          seller_id: 9111,
          sold_quantity: 12,
        },
      ];

      var response = [
        {
          listing_id: "MLA4444",
          title: "Huawei",
          seller_id: 9111,
          initial_sold_quantity: 12,
          quantity: 0,
        },
        {
          listing_id: "MLA2222",
          title: "Motorola",
          seller_id: 5678,
          initial_sold_quantity: 11,
          quantity: 9,
        },
        {
          listing_id: "MLA3333",
          title: "Iphone",
          seller_id: 9101,
          initial_sold_quantity: 11,
          quantity: 14,
        },
      ];

      it("should update MLA2222 and MLA3333 and create MLA4444", (done) => {
        request(app)
          .post("/listings/upsert")
          .send(data) //.end o endasync que devuelve lambda y con el resutlado puedo ordenarlo para no hacer el sort desde el controller
          .expect(200, response, done);
      });

          //  it("should reject as listings are more than 50", (done) => {
          //    request(app)
          //      .post("/listings/upsert")
          //      .send(lista de 51 listings) //.end o endasync que devuelve lambda y con el resutlado puedo ordenarlo para no hacer el sort desde el controller
          //      .expect(400, objeto de error, done);
          //  });
    });

});
