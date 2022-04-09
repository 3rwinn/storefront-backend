import express, { Request, Response } from "express";
import { Product, ProductStore } from "../models/product";
import { abort, verifyAuthToken } from "../helpers";

const productRoutes = (app: express.Application) => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/products", verifyAuthToken, create);
};

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    abort(res, 400, error as unknown as string);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(parseInt(req.params.id));
    if (product) {
      res.json({
        success: true,
        product,
      });
    } else {
      abort(res, 404, "Product not found");
    }
  } catch (error) {
    abort(res, 400, error as unknown as string);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      name: req.body.name,
      price: parseInt(req.body.price),
    };
    const newProduct = await store.create(product);
    res.json({ success: true, product: newProduct });
  } catch (error) {
    abort(res, 400, error as unknown as string);
  }
};

export default productRoutes;
