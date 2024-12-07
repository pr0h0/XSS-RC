const router = require("express").Router();

const dashboardController = require("../controllers/dashboardController");
const userAuth = require("../middlewares/userAuth");

router.get("/dashboard", userAuth(true), dashboardController.index);

module.exports = router;
