import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { TOKEN_SECRET } = process.env;

import { User, UserStore } from "../models/user";

const userRoutes = (app: express.Application) => {
  app.get("/users", index);
  app.get("/users/:id", show);
  app.post("/users", create);
  app.delete("/users/:id", destroy);
  app.post("/users/authenticate", authenticate);
};

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (_req: Request, res: Response) => {
  const id = Number(_req.params.id);
  const user = await store.show(id);
  res.json(user);
};

const create = async (_req: Request, res: Response) => {
  const user: User = {
    username: _req.body.username,
    password: _req.body.password,
  };
  try {
    const newUser = await store.create(user);
    // @ts-ignore
    var token = jwt.sign({ user: newUser }, TOKEN_SECRET);
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (_req: Request, res: Response) => {
  const id = Number(_req.params.id);
  const deleted = await store.delete(id);
  res.json(deleted);
};

const authenticate = async (_req: Request, res: Response) => {
  const user: User = {
    username: _req.body.username,
    password: _req.body.password,
  };
  try {
    const u = await store.authenticate(user.username, user.password);
    if (u === null) {
      res.status(401);
      res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
    // @ts-ignore
    var token = jwt.sign({ user: u }, TOKEN_SECRET);
    res.json({
      success: true,
      token: token,
    });
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

export default userRoutes;
