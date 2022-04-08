import supertest from "supertest";

import app from "../../server";

import { Product } from "../../models/product";
import { User } from "../../models/user";

describe("Product handler", () => {
  let request: supertest.SuperTest<supertest.Test> = supertest(app);
  let token: string;
  let productCreated: Product;

  beforeAll((done) => {
    const user: User = {
      firstname: "Chris",
      lastname: "Rock",
      username: "chris",
      password: "whydidwillsmithslapme",
    };

    request
      .post("/users")
      .send(user)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        token = res.body.token;

        done();
      });
  });

  it("should require authorization on CREATE /products", (done) => {
    request.post("/products").then((res) => {
      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalse();
      done();
    });
  });

  it("should create a product on /products", (done) => {
    const product: Product = {
      name: "Macbook pro M1",
      price: 1500,
    };

    request
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(product)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        productCreated = res.body.product;
        done();
      });
  });

  it("should get the list of products on /products", (done) => {
    request
      .get("/products")
      .set("Authorization", `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.products.length).toBeGreaterThan(0);
        done();
      });
  });

  it("should get a single product on /products/${id}", (done) => {
    request
      .get(`/products/${productCreated.id}`)
      .set("Authorization", `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.product).toEqual(productCreated);
        done();
      });
  });
});
