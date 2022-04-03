import { Book, BookStore } from "../../models/book";

const store = new BookStore();

describe("Book Model", () => {
  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should have a update method", () => {
    expect(store.update).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });

  it("create method should add a book", async () => {
    const result = await store.create({
      title: "Bridge to Terabithia",
      total_pages: 250,
      author: "Katherine Paterson",
      summary: "Childrens",
    });
    expect(result).toEqual({
      id: 1,
      title: "Bridge to Terabithia",
      total_pages: 250,
      author: "Katherine Paterson",
      summary: "Childrens",
    });
  });

  it("index method should return a list of books", async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        title: "Bridge to Terabithia",
        total_pages: 250,
        author: "Katherine Paterson",
        summary: "Childrens",
      },
    ]);
  });

  it("show method should return the correct book", async () => {
    const result = await store.show(1);
    expect(result).toEqual({
      id: 1,
      title: "Bridge to Terabithia",
      total_pages: 250,
      author: "Katherine Paterson",
      summary: "Childrens",
    });
  });

  it("update method should return the updated book", async () => {
    const bookUpdate: Book = {
      id: 1,
      title: "Bridge to Abidjan",
      total_pages: 230,
      author: "Abou Dia",
      summary: "Childrens",
    };
    const result = await store.update(bookUpdate);
    expect(result).toEqual({
      id: 1,
      title: "Bridge to Abidjan",
      total_pages: 230,
      author: "Abou Dia",
      summary: "Childrens",
    });
  });

  it("delete method should remove the book", async () => {
    store.delete(1);
    const result = await store.index();

    expect(result).toEqual([]);
  });
});
