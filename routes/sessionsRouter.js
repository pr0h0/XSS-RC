const router = require("express").Router();

const sessionsController = require("../controllers/sessionsController");
const userAuth = require("../middlewares/userAuth");

router.get("/sessions", userAuth(true), sessionsController.index);

module.exports = router;
