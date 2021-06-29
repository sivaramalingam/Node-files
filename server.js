const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
dotenv.config();
const routes = require('./routes/index');

const db = require('./config/db');

const app = express();
db.connectDb();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);

const server = app.listen(process.env.PORT || 8000, () => {
  const port = server.address().port;
  console.log("App now running on port", port);
});