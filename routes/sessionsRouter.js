const router = require("express").Router();

const sessionsController = require("../controllers/sessionsController");
const userAuth = require("../middlewares/userAuth");

router.get("/sessions", userAuth(true), sessionsController.index);
router.get("/sessions/:id", userAuth(true), sessionsController.singleSession);
router.get(
  "/sessions/find/:id",
  userAuth(true),
  sessionsController.findNextOneOpen,
);
router.post(
  "/sessions/delete",
  userAuth(true),
  sessionsController.deleteSessions,
);

module.exports = router;
