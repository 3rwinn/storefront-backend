import supertest from "supertest";
import jwt, { Secret } from "jsonwebtoken";

import app from "../../server";

import { User } from "../../models/user";
import { ProductStore } from "../../models/product";
import { Order } from "../../models/order";

const productStoreInstance = new ProductStore();

describe("Order handler", () => {
  let request: supertest.SuperTest<supertest.Test> = supertest(app);
  let secret: Secret = process.env.TOKEN_SECRET as Secret;
  let token: string;
  let orderId: number;
  let userId: number;

  beforeAll((done) => {
    const user: User = {
      firstname: "Jeff",
      lastname: "Bezos",
      username: "jeffb",
      password: "billionsdollarsman",
    };

    // Create an user
    request
      .post("/users")
      .send(user)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        token = res.body.token;
        // @ts-ignore
        const { user } = jwt.verify(token, secret);
        userId = user.id;

        done();
      });
  });

  afterAll(async () => {
    await request
      .delete(`/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`);
  });

  it("should require authentication on GET /orders", (done) => {
    request.get("/orders").then((res) => {
      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalse();
      done();
    });
  });

  it("should require authentication on GET /orders/:id", (done) => {
    request.get("/orders/1").then((res) => {
      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalse();
      done();
    });
  });

  it("should require authentication on POST /orders", (done) => {
    request.post("/orders").then((res) => {
      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalse();
      done();
    });
  });

  it("shoud require authentication on UPDATE /orders/:id", (done) => {
    request.put("/orders/1").then((res) => {
      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalse();
      done();
    });
  });

  it("should require authentication on DELETE /orders/:id", (done) => {
    request.delete("/orders/1").then((res) => {
      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalse();
      done();
    });
  });

  it("should require authentication on post /orders/:id/products", (done) => {
    request.post("/orders/1/products").then((res) => {
      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalse();
      done();
    });
  });

  it("should require authentication on get /orders/users/:id", (done) => {
    request.get("/orders/users/1").then((res) => {
      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalse();
      done();
    });
  });

  it("should create an order on /orders", (done) => {
    const order: Order = {
      user_id: userId,
    };

    request
      .post("/orders")
      .send(order)
      .set("Authorization", `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        orderId = res.body.order.id;
        done();
      });
  });

  it("should update an order on /orders/:id", (done) => {
    request
      .put(`/orders/${orderId}`)
      .send({
        user_id: userId,
        status: "delivered",
      })
      .set("Authorization", `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        done();
      });
  });

  it("should add a product to an order on /orders/:id/products", async () => {
    const productCreated = await productStoreInstance.create({
      name: "iPhone X",
      price: 1455,
    });

    request
      .post(`/orders/${orderId}/products`)
      .send({
        product_id: productCreated.id,
        quantity: 1,
      })
      .set("Authorization", `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });
  });

  it("should get all orders by user on /orders/users/:id", (done) => {
    request
      .get(`/orders/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        done();
      });
  });
});
