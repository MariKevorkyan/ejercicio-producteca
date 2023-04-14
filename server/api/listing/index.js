var express = require("express");
var controller = require("./listing.controller");
var router = express.Router();

var { route } = require("endpoint-handler")(router)

route.get("/", controller.getAll);

route.get("/ranking", controller.getNOrderedBySold); 

route.post("/", controller.create);

route.post("/upsert", controller.createAndUpdate);

route.get("/:listing_id", controller.getOne);

route.put("/:listing_id", controller.update);

module.exports = router;

//ranking?amount=N -> para opcionales

