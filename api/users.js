import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
import { createUser, getUserByCredentials } from "#db/queries/users";
import { createToken } from "#utils/jwt";

router.post("/register", requireBody(["username", "password"]), async (req, res) => {
  const { username, password } = req.body;

  const user = await createUser(username, password);
  const token = createToken({ id: user.id });

  res.status(201).send(token);
});

router.post("/login", requireBody(["username", "password"]), async (req, res) => {
  const { username, password } = req.body;

  const user = await getUserByCredentials(username, password);
  if (!user) return res.status(401).send("Invalid credentials.");

  const token = createToken({ id: user.id });
  res.send(token);
});
