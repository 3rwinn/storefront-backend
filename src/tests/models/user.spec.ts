import bcrypt from "bcrypt";
import { User, UserStore } from "../../models/user";

const store = new UserStore();

const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;

describe("User model", () => {
  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });
  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });
  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });
  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });
  it("should have an authenticate method", () => {
    expect(store.authenticate).toBeDefined();
  });
  it("create method should add a user", async () => {
    const chosenPasswordHash = bcrypt.hashSync(
      "test" + pepper,
      //@ts-ignore
      parseInt(saltRounds)
    );
    const result = await store.create({
      username: "test",
      password: chosenPasswordHash,
    });
    expect(result.username).toEqual("test");
  });
  it("index method should return users list", async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);
  });
  it("show method should return a user", async () => {
    const result = await store.show(1);
    expect(result.username).toEqual("test");
  });
  it("delete method should should delete the user", async () => {
    const result = await store.delete(1);
    expect(result).toBe(true);
  });
  it("authenticate method should return a user", async () => {
    const result = await store.authenticate("test", "test");
    if (result) {
      expect(result).not.toBeNull();
      expect(result.username).toEqual("test");
    }
  });
});
