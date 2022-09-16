import express from "express";
import { userRouter } from "./users/users.js";
const port = 8000;
const app = express();

app.all("/hello", (req, res, next) => {
  console.log("All");
  next();
});

app
  .get("/hello", (req, res) => {
    // res.send({ success: true });
    throw new Error("");
  })
  .post("/hello", (req, res) => {
    res.set("Content-Type", "application/json");
    res.status(201).json({ success: true });
  });

app.use("/users", userRouter);

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

app.listen(port, () => {
  console.log("server listeting");
});
