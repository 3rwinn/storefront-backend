import express, { Request, Response } from "express";
import { Book, BookStore } from "../models/book";
import { verifyAuthToken } from "../middlewares";

const store = new BookStore();

const index = async (_req: Request, res: Response) => {
  const books = await store.index();
  res.json(books);
};

const show = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const book = await store.show(id);
  res.json(book);
};

const create = async (req: Request, res: Response) => {
  try {
    const book: Book = {
      title: req.body.title,
      author: req.body.author,
      total_pages: parseInt(req.body.total_pages),
      summary: req.body.summary,
    };
    const newBook = await store.create(book);
    res.json(newBook);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(parseInt(req.params.id));
  res.json(deleted);
};

const bookRoutes = (app: express.Application) => {
  app.get("/books", index);
  app.get("/books/:id", show);
  app.post("/books", verifyAuthToken, create);
  app.delete("/books/:id", verifyAuthToken, destroy);
};

export default bookRoutes;
