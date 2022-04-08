import express, { Request, Response } from "express";
import { abort, verifyAuthToken } from "../helpers";
import { Order, OrderProduct, OrderStore } from "../models/order";
import { UserStore } from "../models/user";

const orderRoutes = (app: express.Application) => {
  app.get("/orders", verifyAuthToken, index),
    app.get("/orders/:id", verifyAuthToken, show),
    app.post("/orders", verifyAuthToken, create),
    app.put("/orders/:id", verifyAuthToken, update),
    app.delete("/orders/:id", verifyAuthToken, destroy),
    app.post("/orders/:id/products", verifyAuthToken, addProduct);
  app.get("/orders/users/:id", verifyAuthToken, ordersByUser);
};

const store = new OrderStore();
const userStore = new UserStore();

const index = async (_req: Request, res: Response) => {
  const orders = await store.index();
  res.json({
    success: true,
    orders,
  });
};

const show = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const order = await store.show(id);
  if (order) {
    res.json({
      success: true,
      order,
    });
  } else {
    abort(res, 404, "Order not found");
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      user_id: parseInt(req.body.user_id),
    };
    const newOrder = await store.create(order);
    res.json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    abort(res, 400, error as unknown as string);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const order = await store.show(id);
    if (order) {
      const updatedOrder = await store.update(id, req.body.status);
      res.json({
        success: true,
        order: updatedOrder,
      });
    } else {
      abort(res, 404, "Order not found");
    }
  } catch (error) {
    abort(res, 400, error as unknown as string);
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(parseInt(req.params.id));
  if (deleted) {
    res.json({
      success: true,
      deleted,
    });
  } else {
    abort(res, 404, "Order not found");
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const productId = parseInt(req.body.product_id);
    const quantity = parseInt(req.body.quantity);
    const orderProduct: OrderProduct = await store.addProduct(
      orderId,
      productId,
      quantity
    );
    res.json({
      success: true,
      order: orderProduct,
    });
  } catch (error) {
    abort(res, 400, error as unknown as string);
  }
};

const ordersByUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const userFound = await userStore.show(userId);
    if (userFound) {
      const orders = await store.ordersByUser(userId);
      res.json({
        success: true,
        orders,
      });
    } else {
      abort(res, 404, "User not found");
    }
  } catch (error) {
    abort(res, 400, error as unknown as string);
  }
};

export default orderRoutes;
