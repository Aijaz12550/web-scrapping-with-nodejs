var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
const rp = require("request-promise");
const $ = require("cheerio");
const { parse } = require("node-html-parser");

const url = "https://dataroma.com/m/home.php";

rp(url)
  .then(function (html) {
    // console.log("====>",html);
    const test = parse(html, {
      lowerCaseTagName: false, // convert tag name to lower case (hurt performance heavily)
      comment: false, // retrieve comments (hurt performance slightly)
      blockTextElements: {
        script: true, // keep text content when parsing
        noscript: true, // keep text content when parsing
        style: true, // keep text content when parsing
        pre: true, // keep text content when parsing
      },
    });
    console.log("root", test.querySelector("#port_body").toString().split('li'));

    //success!
    // console.log("html",html);
    // console.log($('big > a', html).length);
    // console.log($('big > a', html).prevObject['0'].children);
  })
  .catch(function (err) {
    //handle error
    console.log("err", err);
  });
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
