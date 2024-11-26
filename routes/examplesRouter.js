const router = require("express").Router();

const exampleController = require("../controllers/exampleController");
const userAuth = require("../middlewares/userAuth");

router.get("/example/:id", userAuth(true), exampleController.index);

module.exports = router;
