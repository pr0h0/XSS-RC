const router = require("express").Router();

const historyController = require("../controllers/historyController");
const userAuth = require("../middlewares/userAuth");

router.get("/history", userAuth(true), historyController.index);
router.delete(
  "/api/history/delete",
  userAuth(true),
  historyController.api.delete
);

module.exports = router;
