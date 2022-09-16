import express from "express";

const port = 8000;
const app = express();

app.all("/hello", (req, res, next) => {
  console.log("All");
  next();
});

app
  .route("/user")
  .get("/hello", (req, res) => {
    res.send("Hello! I'm simple server! GET");
  })
  .post("/hello", (req, res) => {
    res.send("Hello! I'm simple server! POST");
  });

app.listen(port, () => {
  console.log("server listeting");
});
