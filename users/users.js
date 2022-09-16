import express from "express";

const userRouter = express.Router();

userRouter.post("/login", (req, res) => {
  res.json({ status: true });
});

userRouter.post("/registration", (req, res) => {
  res.json({ status: true });
});

export { userRouter };
