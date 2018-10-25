/* eslint-disable no-param-reassign */
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request-promise");

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-cache, no-store, must-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

const API_KEY = {'X-CMC_PRO_API_KEY':'4d7d35fe-9265-43cc-8344-612758f55d31'};

app.get("/listings", (req, res) => {
  const val = req.query.val || 'USD';
  const pos = req.query.pos || 1;
  request({
    url: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=${val}&start=${pos}`,
    headers: API_KEY,
    json: true
  })
    .then(response => {
      res.setHeader("Cache-Control", "no-cache");
      res.json(response);
    })
    .catch(error => {
      console.log(error);  // eslint-disable-line no-console
    });
});

app.get("/market", (req, res) => {
  request({
    url: `https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest`,
    headers: API_KEY,
    json: true
  })
    .then(response => {
      res.setHeader("Cache-Control", "no-cache");
      res.json(response);
    })
    .catch(error => {
      console.log(error);  // eslint-disable-line no-console
    });
});

app.listen(app.get("port"), () => {
  console.log( // eslint-disable-line no-console
    `Find the server at: http://localhost:${app.get(
      "port"
    )}/`
  );
});
