import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { TOKEN_SECRET } = process.env;

import { User, UserAuth, UserStore } from "../models/user";
import { abort, verifyAuthToken } from "../helpers";

const userRoutes = (app: express.Application) => {
  app.post("/users", create);
  app.get("/users", verifyAuthToken, index);
  app.get("/users/:id", verifyAuthToken, show);
  app.delete("/users/:id", verifyAuthToken, destroy);
  app.post("/users/authenticate", authenticate);
};

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json({
    success: true,
    users,
  });
};

const show = async (_req: Request, res: Response) => {
  const id = parseInt(_req.params.id);
  const user = await store.show(id);
  if (user) {
    res.json({ success: true, user });
  } else {
    abort(res, 404, "User not found");
  }
};

const create = async (_req: Request, res: Response) => {
  const user: User = {
    firstname: _req.body.firstname,
    lastname: _req.body.lastname,
    username: _req.body.username,
    password: _req.body.password,
  };
  try {
    const newUser = await store.create(user);
    // @ts-ignore
    var token = jwt.sign({ user: newUser }, TOKEN_SECRET);
    res.json({
      success: true,
      token: token,
    });
  } catch (err) {
    abort(res, 400, err as unknown as string);
  }
};

const destroy = async (_req: Request, res: Response) => {
  const id = parseFloat(_req.params.id);
  const deleted = await store.delete(id);
  if (deleted) {
    res.json({
      success: true,
      deleted,
    });
  } else {
    abort(res, 404, "User not found");
  }
};

const authenticate = async (_req: Request, res: Response) => {
  const user: UserAuth = {
    username: _req.body.username,
    password: _req.body.password,
  };
  try {
    const u = await store.authenticate(user.username, user.password);
    if (u === null) {
      abort(res, 401, "Invalid credentials");
    }
    // @ts-ignore
    var token = jwt.sign({ user: u }, TOKEN_SECRET);
    res.json({
      success: true,
      token: token,
    });
  } catch (err) {
    abort(res, 400, err as unknown as string);
  }
};

export default userRoutes;
