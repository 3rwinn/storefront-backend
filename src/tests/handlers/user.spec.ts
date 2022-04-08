import supertest from "supertest";
import jwt, { Secret } from "jsonwebtoken";

import app from "../../server";

import { User, UserAuth } from "../../models/user";

describe("User handler", () => {
  let request: supertest.SuperTest<supertest.Test> = supertest(app);
  let secret: Secret = process.env.TOKEN_SECRET as Secret;
  let token: string;
  let user_id: number;

  it("should require authorization on GET /users", (done) => {
    request.get("/users").then((res) => {
      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalse();
      done();
    });
  });

  it("should require authorization on GET /user/${id}", (done) => {
    request.get("/users/1").then((res) => {
      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalse();
      done();
    });
  });

  it("should require authorization on DELETE /user/${id}", (done) => {
    request.delete("/users/1").then((res) => {
      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalse();
      done();
    });
  });

  it("should create a user on /users", (done) => {
    const user: User = {
      firstname: "Sam",
      lastname: "Bone",
      username: "sambone",
      password: "eyiii324",
    };

    request
      .post("/users")
      .send(user)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        token = res.body.token;
        // @ts-ignore
        const { user } = jwt.verify(token, secret);
        user_id = user.id;
        done();
      });
  });

  it("should get the list of users on /users", (done) => {
    request
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        done();
      });
  });

  it("should get a single user on /users/${id}", (done) => {
    request
      .get(`/users/${user_id}`)
      .set("Authorization", `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        done();
      });
  });

  it("should authenticate the user /users/authenticate", (done) => {
    const user: UserAuth = {
      username: "sambone",
      password: "eyiii324",
    };

    request
      .post("/users/authenticate")
      .send(user)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        done();
      });
  });

  it("should delete an user /users/${id}", (done) => {
    request
      .delete(`/users/${user_id}`)
      .set("Authorization", `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        done();
      });
  });
});
