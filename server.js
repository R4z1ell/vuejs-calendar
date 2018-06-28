require("dotenv").config({ silent: true });

const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const http = require("http");
const moment = require("moment-timezone");
moment.tz.setDefault("UTC");
/* This 'serialize-javascript' package will help us to CONVERT the Objects we have INSIDE the 'events' Array 
here below into STRINGS so that we can then PRINT them in our 'index.html' file */
const serialize = require("serialize-javascript");

app.use("/public", express.static(path.join(__dirname, "public")));

let events = [
  {
    description: "Random event 1",
    date: moment("2018-06-15", "YYYY-MM-DD")
  },
  {
    description: "Random event 2",
    date: moment("2018-06-25", "YYYY-MM-DD")
  },
  {
    description: "Random event 3",
    date: moment("2018-07-7", "YYYY-MM-DD")
  }
];

let renderer;

app.get("/", (req, res) => {
  let template = fs.readFileSync(path.resolve("./index.html"), "utf-8");
  let contentMarker = "<!--APP-->";
  if (renderer) {
    /* Here we're using the 'renderToString' method to CONVERT the 'bundle'(created by this 'renderer') to a STRING,
    so into HTML pretty much, the last step is to SPLICE(collegare) this HTML into our actual 'index.html' file  */
    renderer.renderToString({ events }, (err, html) => {
      if (err) {
        console.log(err);
      } else {
        res.send(
          template.replace(
            contentMarker,
            `<script>var __INITIAL_STATE__ = ${serialize(
              events
            )}</script>\n${html}`
          )
        );
      }
    });
  } else {
    res.send(
      "<p>Awaiting compilation..</p><script src='/reload/reload.js'></script>"
    );
  }
});

/* Here we're telling 'Express' to use the body-parser' Library that takes INCOMING 'request' bodies and parse(
analizza) them, in our case we're using the 'json' middleware because the format of the 'req.body' is in json */
app.use(require("body-parser").json());
app.post("/add_event", (req, res) => {
  events.push({
    description: req.body.description,
    date: moment(req.body.date)
  });
  res.sendStatus(200);
});

const server = http.createServer(app);

if (process.env.NODE_ENV === "development") {
  const reload = require("reload");
  const reloadServer = reload(server, app);
  require("./webpack-dev-middleware").init(app);
  require("./webpack-server-compiler").init(function(bundle) {
    let needsReload = renderer === undefined;
    /* Here we're using the 'vue-server-renderer' package, his job is output the CORRECT server version of our App,
    we just have to use this 'createBundleRenderer' method(coming from this 'vue-server-renderer' package) where we
    pass the 'bundle' we just created in the line above with the 'webpack-server-compiler' */
    renderer = require("vue-server-renderer").createBundleRenderer(bundle);
    if (needsReload) {
      reloadServer.reload();
    }
  });
}

if (process.env.NODE_ENV === "production") {
  let bundle = fs.readFileSync("./dist/node.bundle.js", "utf8");
  renderer = require("vue-server-renderer").createBundleRenderer(bundle);
  app.use("/dist", express.static(path.join(__dirname, "dist")));
}

server.listen(process.env.PORT, function() {
  console.log(`Example app listening on port ${process.env.PORT}!`);
  if (process.env.NODE_ENV === "development") {
    require("open")(`http://localhost:${process.env.PORT}`);
  }
});
