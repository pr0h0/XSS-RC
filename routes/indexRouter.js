const router = require("express").Router();

const indexController = require("../controllers/indexController");
const userAuth = require("../middlewares/userAuth");

router.get("/", userAuth(true), indexController.index);
router.all("*", userAuth(false), indexController["404"]);

module.exports = router;
