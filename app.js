var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cons = require("consolidate");
var dust = require("dustjs-helpers");
var app = express();

//Connection String
var connectionString = "postgres://harvard:240996@localhost/reciepebookdb";

//Assign Dust Engine to .dust Files

app.engine("dust", cons.dust);
app.set("view engine", "dust");
app.set("views", __dirname + "/views");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const { Pool, Client } = require("pg");
const pool = new Pool({
  connectionString: connectionString,
});
const client = new Client({
  connectionString: connectionString,
});

app.get("/", function (req, res) {
  pool.connect();
  pool.query("SELECT * FROM receipes ORDER BY id DESC", (err, result) => {
    console.log(err, result);
    res.render("index", { receipes: result.rows });
    // pool.end();
  });
});

app.post("/add", function (req, res) {
  client.connect();
  client.query(
    "INSERT INTO receipes(name, ingredients, directions) VALUES($1, $2, $3)",
    [req.body.name, req.body.ingredients, req.body.directions],
    (err, result) => {
      console.log(err, result);
      res.redirect("/");
      // client.end();
    }
  );
});

app.post("/edit", function (req, res) {
  client.connect();
  client.query(
    "UPDATE receipes SET name = $1, ingredients = $2, directions = $3 WHERE id = $4",
    [req.body.name, req.body.ingredients, req.body.directions, req.body.id],
    (err, result) => {
      console.log(err, result);
      res.redirect("/");
    }
  );
});

app.delete("/delete/:id", function (req, res) {
  client.connect();
  client.query("DELETE FROM receipes WHERE id = $1", [req.params.id]);
  res.send(200);
});
//Server
app.listen(3000, function () {
  console.log("Server started on Port 3000");
});
