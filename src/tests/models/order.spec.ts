import { Order, OrderProduct, OrderStore } from "../../models/order";
import { User, UserStore } from "../../models/user";
import { Product, ProductStore } from "../../models/product";

const store = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

let order_id: number, user_id: number, product_id: number;

describe("Order Model", () => {
  beforeAll(async () => {
    // Create user
    const user: User = await userStore.create({
      firstname: "Sam",
      lastname: "Bone",
      username: "sambone",
      password: "eyiii324",
    });

    user_id = user.id as unknown as number;

    // Create product
    const product: Product = await productStore.create({
      name: "Test Product",
      price: 100,
    });

    product_id = product.id as unknown as number;

    // Create order
    const order: Order = await store.create({
      user_id,
    });

    order_id = order.id as unknown as number;

    // Add product to order
    await store.addProduct(order_id, product_id, 1);
  });

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });
  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });
  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });
  it("should an have a update method", () => {
    expect(store.update).toBeDefined();
  });
  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });

  it("should have and addProduct method", () => {
    expect(store.addProduct).toBeDefined();
  });
  it("it should have a ordersByUser method", () => {
    expect(store.ordersByUser).toBeDefined();
  });

  it("create method should add a order", async () => {
    const result = await store.create({
      user_id: user_id,
    });
    expect(result).not.toBeNull();
    expect(result.status).toBe("active");
  });

  it("update method should update the order", async () => {
    const result = await store.update(order_id, "completed");
    expect(result).not.toBeNull();
    expect(result.status).toBe("completed");
  });

  it("index method should return a list of orders", async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it("show method should return the correct order", async () => {
    const result = await store.show(order_id);
    expect(result).not.toBeNull();
    expect(result.products.length).toBeGreaterThan(0);
  });

  it("addProduct method should add a product to an order", async () => {
    const result = await store.addProduct(order_id, product_id, 1);
    expect(result).not.toBeNull();
    expect(result).toEqual({
      order_id,
      product_id,
      quantity: 1,
    });
  });

  it("delete method should delete the order", async () => {
    const result = await store.delete(order_id);
    expect(result).not.toBeNull();
    expect(result.id).toBe(order_id);
  });
});
