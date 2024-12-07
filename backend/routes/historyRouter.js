const router = require("express").Router();

const historyController = require("../controllers/historyController");
const userAuth = require("../middlewares/userAuth");

router.get("/history", userAuth(true), historyController.index);

module.exports = router;
