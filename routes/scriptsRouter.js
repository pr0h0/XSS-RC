const router = require("express").Router();

const scriptsController = require("../controllers/scriptsController");
const userAuth = require("../middlewares/userAuth");

router.get("/scripts", userAuth(true), scriptsController.index);
router.post("/scripts/new", userAuth(true), scriptsController.postNew);
router.post(
  "/scripts/:id/delete",
  userAuth(true),
  scriptsController.deleteScript,
);
router.get(
  "/scripts/:id/script.js",
  userAuth(true),
  scriptsController.getRawScript,
);

module.exports = router;
