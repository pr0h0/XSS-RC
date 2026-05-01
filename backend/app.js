const path = require("path");
const fs = require("fs");

const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser(process.env.AUTH_PASSWORD));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE");
    next();
  });
}

// SPA fallback: serve React app for non-API GET requests when built
const spaIndexPath = path.join(__dirname, "public", "index.html");
const spaEnabled = fs.existsSync(spaIndexPath);
if (spaEnabled) {
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    if (req.path === "/check" || req.path === "/logout") return next();
    if (req.path.startsWith("/scripts/") && req.path.endsWith("/script.js"))
      return next();
    if (req.path.startsWith("/screenshots/")) return next();
    res.sendFile(spaIndexPath);
  });
}

app.use(require("./middlewares/errorHandler"));
app.use(require("./routes"));

// set all previous sessions to closed if some are marked as open
require("./services/sessionsService").closeAllSessions();

module.exports = app;
