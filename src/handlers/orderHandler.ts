import express, { Request, Response } from "express";
import { verifyAuthToken } from "../middlewares";
import { Order, OrderBook, OrderStore } from "../models/order";

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
  const orders = await store.index();
  res.json(orders);
};

const show = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const order = await store.show(id);
  res.json(order);
};

const create = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      user_id: parseInt(req.body.user_id),
    };
    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (error) {
    res.status(500);
    res.json(error);
    console.log("error", error)
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(parseInt(req.params.id));
  res.json(deleted);
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const bookId = parseInt(req.body.book_id);
    const quantity = parseInt(req.body.quantity);
    const orderBook: OrderBook = await store.addBook(orderId, bookId, quantity);
    res.json(orderBook);
  } catch (error) {
    res.status(500);
    res.json(error);
    console.log("error", error)
  }
};

const orderRoutes = (app: express.Application) => {
  app.get("/orders", index),
    app.get("/orders/:id", show),
    app.post("/orders", verifyAuthToken, create),
    app.delete("/orders/:id", verifyAuthToken, destroy),
    app.post("/orders/:id/books", verifyAuthToken, addProduct);
};

export default orderRoutes;
