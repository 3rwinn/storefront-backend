import { Product, ProductStore } from "../../models/product";

const store = new ProductStore();

describe("Product Model", () => {
  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });
  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });
  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("create method should add a product", async () => {
    const result = await store.create({
      name: "Iphone 12",
      price: 250,
    });
    expect(result.name).toEqual("Iphone 12");
    expect(result.price).toEqual(250);
  });

  it("index method should return a list of products", async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it("show method should return the correct product", async () => {
    const result = await store.show(1);
    expect(result).not.toBeNull();
  });
});
