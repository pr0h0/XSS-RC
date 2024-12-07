const router = require("express").Router();

const authController = require("../controllers/authController");
const userAuth = require("../middlewares/userAuth");

router.get("/login", userAuth(false), authController.getLogin);
router.post("/login", authController.postLogin);
router.all("/logout", userAuth(false), authController.getLogout);

module.exports = router;
